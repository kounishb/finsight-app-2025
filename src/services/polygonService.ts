export interface PolygonStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  close?: number;
  open?: number;
  high?: number;
  low?: number;
}

export interface PolygonApiResponse {
  status: string;
  results: Array<{
    T: string; // ticker symbol
    v: number; // volume
    vw: number; // volume weighted average price
    o: number; // open
    c: number; // close
    h: number; // high
    l: number; // low
    t: number; // timestamp
    n: number; // number of transactions
  }>;
  resultsCount: number;
  adjusted: boolean;
  queryCount: number;
  request_id: string;
}

class PolygonService {
  private readonly baseUrl = 'https://api.polygon.io/v2';
  private readonly apiKey: string;
  private inMemoryCache: { stocks?: { data: PolygonStock[]; fetchedAt: number } } = {};
  private readonly localStorageKey = 'polygon_all_stocks_cache_v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_POLYGON_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Polygon API key not found in environment variables');
    }
  }

  private getPreviousBusinessDay(): string {
    const today = new Date();
    let previousDay = new Date(today);
    
    // Go back one day
    previousDay.setDate(today.getDate() - 1);
    
    // If it's Sunday (0), go back to Friday
    if (previousDay.getDay() === 0) {
      previousDay.setDate(previousDay.getDate() - 2);
    }
    // If it's Saturday (6), go back to Friday
    else if (previousDay.getDay() === 6) {
      previousDay.setDate(previousDay.getDate() - 1);
    }
    
    return previousDay.toISOString().split('T')[0];
  }

  private getBusinessDayOffset(offsetDays: number): string {
    // offsetDays: 0 -> yesterday or prev business day logic, 1 -> one more day back, etc.
    const today = new Date();
    let day = new Date(today);
    // start from yesterday baseline
    day.setDate(today.getDate() - 1);
    // walk back offsetDays additional business days
    let remaining = offsetDays;
    while (remaining > 0) {
      day.setDate(day.getDate() - 1);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        remaining -= 1;
      }
    }
    // ensure it's a business day
    if (day.getDay() === 0) {
      day.setDate(day.getDate() - 2);
    } else if (day.getDay() === 6) {
      day.setDate(day.getDate() - 1);
    }
    return day.toISOString().split('T')[0];
  }

  private loadFromLocalStorage(): { data: PolygonStock[]; fetchedAt: number } | null {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) return null;
      const raw = window.localStorage.getItem(this.localStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.data) || typeof parsed.fetchedAt !== 'number') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private saveToLocalStorage(payload: { data: PolygonStock[]; fetchedAt: number }) {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) return;
      window.localStorage.setItem(this.localStorageKey, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }

  public getCachedStocks(ttlMs: number = 15 * 60 * 1000): PolygonStock[] | null {
    const now = Date.now();
    // prefer in-memory if fresh
    if (this.inMemoryCache.stocks && now - this.inMemoryCache.stocks.fetchedAt < ttlMs) {
      return this.inMemoryCache.stocks.data;
    }
    // try localStorage
    const ls = this.loadFromLocalStorage();
    if (ls && now - ls.fetchedAt < ttlMs && Array.isArray(ls.data) && ls.data.length > 0) {
      // warm in-memory cache for faster subsequent reads
      this.inMemoryCache.stocks = ls;
      return ls.data;
    }
    return null;
  }

  private async fetchGroupedByDate(date: string): Promise<PolygonStock[]> {
    const url = `${this.baseUrl}/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    const data: PolygonApiResponse = await response.json();
    if (data.status !== 'OK' || !data.results) {
      throw new Error('Invalid response from Polygon API');
    }
    const stocks: PolygonStock[] = data.results.map(result => {
      const changeAmount = result.c - result.o;
      const changePercent = ((changeAmount / result.o) * 100);
      return {
        symbol: result.T,
        name: result.T,
        price: result.c,
        change: changePercent,
        changePercent: changePercent,
        volume: result.v,
        close: result.c,
        open: result.o,
        high: result.h,
        low: result.l
      };
    });
    return stocks.filter(stock => stock.price > 1);
  }

  async getAllStocks(): Promise<PolygonStock[]> {
    try {
      // Serve from cache if recent (e.g., within 5 minutes)
      const cacheTtlMs = 5 * 60 * 1000;
      const cached = this.inMemoryCache.stocks;
      const now = Date.now();
      if (cached && now - cached.fetchedAt < cacheTtlMs) {
        return cached.data;
      }

      // Try yesterday, then walk back up to 3 previous business days
      const maxLookbackBusinessDays = 3;
      let lastError: unknown = null;
      for (let offset = 0; offset <= maxLookbackBusinessDays; offset++) {
        try {
          const date = offset === 0 ? this.getPreviousBusinessDay() : this.getBusinessDayOffset(offset);
          const stocks = await this.fetchGroupedByDate(date);
          // Simple sanity check to avoid empty/degenerate data
          if (stocks && stocks.length > 50) {
            this.inMemoryCache.stocks = { data: stocks, fetchedAt: now };
            this.saveToLocalStorage(this.inMemoryCache.stocks);
            return stocks;
          }
        } catch (err) {
          lastError = err;
        }
      }

      // As a last resort, throw the last error
      throw lastError || new Error('Failed to fetch stocks from Polygon after lookback');
      
    } catch (error) {
      console.error('Error fetching stocks from Polygon:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<PolygonStock | null> {
    try {
      const date = this.getPreviousBusinessDay();
      const url = `${this.baseUrl}/aggs/ticker/${symbol}/range/1/day/${date}/${date}?adjusted=true&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        return null;
      }

      const result = data.results[0];
      const changeAmount = result.c - result.o;
      const changePercent = ((changeAmount / result.o) * 100);
      
      return {
        symbol: symbol,
        name: symbol,
        price: result.c,
        change: changePercent,
        changePercent: changePercent,
        volume: result.v,
        close: result.c,
        open: result.o,
        high: result.h,
        low: result.l
      };
      
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }
}

export const polygonService = new PolygonService();
export default polygonService;