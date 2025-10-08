import { supabase } from '@/integrations/supabase/client';

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

class PolygonService {
  async getAllStocks(): Promise<PolygonStock[]> {
    try {
      const { data, error } = await supabase.functions.invoke('polygon-stocks');
      
      if (error) {
        console.error('Error calling polygon-stocks function:', error);
        throw error;
      }

      if (!data || !data.stocks) {
        throw new Error('Invalid response from polygon-stocks function');
      }

      // Transform the response to match PolygonStock interface
      const stocks: PolygonStock[] = data.stocks.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price || stock.close,
        change: stock.change,
        changePercent: stock.change,
        volume: typeof stock.volume === 'string' ? parseFloat(stock.volume) : stock.volume,
        close: stock.close,
        open: stock.open,
        high: stock.high,
        low: stock.low
      }));

      return stocks;
      
    } catch (error) {
      console.error('Error fetching stocks from Polygon:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<PolygonStock | null> {
    try {
      // For individual stock quotes, we'll fetch from all stocks and filter
      const allStocks = await this.getAllStocks();
      const stock = allStocks.find(s => s.symbol === symbol);
      
      return stock || null;
      
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }
}

export const polygonService = new PolygonService();
export default polygonService;