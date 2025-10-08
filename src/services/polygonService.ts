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

  async getAllStocks(): Promise<PolygonStock[]> {
    try {
      const date = this.getPreviousBusinessDay();
      const url = `${this.baseUrl}/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
      }
      
      const data: PolygonApiResponse = await response.json();
      
      if (data.status !== 'OK' || !data.results) {
        throw new Error('Invalid response from Polygon API');
      }

      // Transform Polygon data to our stock format
      const stocks: PolygonStock[] = data.results.map(result => {
        const changeAmount = result.c - result.o;
        const changePercent = ((changeAmount / result.o) * 100);
        
        return {
          symbol: result.T,
          name: result.T, // Polygon grouped endpoint doesn't provide company names
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

      // Filter out stocks with very low prices (likely penny stocks or invalid data)
      return stocks.filter(stock => stock.price > 1);
      
    } catch (error) {
      console.error('Error fetching stocks from Polygon:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<PolygonStock | null> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        console.warn('Polygon API key not available, returning null');
        return null;
      }

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