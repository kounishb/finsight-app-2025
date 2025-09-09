import { supabase } from "@/integrations/supabase/client";

export interface AlphaVantageStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
  peRatio?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image?: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  overall_sentiment_score?: number;
  overall_sentiment_label?: string;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

// Mock data for development
const MOCK_STOCKS: AlphaVantageStock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.45, change: 2.34, changePercent: 1.35 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.92, change: -1.23, changePercent: -0.32 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 134.87, change: 0.95, changePercent: 0.71 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.32, change: 3.21, changePercent: 2.26 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 785.43, change: 15.67, changePercent: 2.03 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 234.56, change: -4.32, changePercent: -1.81 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 487.23, change: 7.89, changePercent: 1.65 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 567.89, change: 12.34, changePercent: 2.22 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 143.21, change: 2.45, changePercent: 1.74 },
  { symbol: "CRM", name: "Salesforce Inc.", price: 245.67, change: -1.89, changePercent: -0.76 },
  { symbol: "ORCL", name: "Oracle Corporation", price: 123.45, change: 1.23, changePercent: 1.01 },
  { symbol: "ADBE", name: "Adobe Inc.", price: 456.78, change: 5.67, changePercent: 1.26 },
  { symbol: "INTC", name: "Intel Corporation", price: 43.21, change: -0.56, changePercent: -1.28 },
  { symbol: "IBM", name: "International Business Machines", price: 167.89, change: 0.78, changePercent: 0.47 },
  { symbol: "CSCO", name: "Cisco Systems Inc.", price: 54.32, change: 0.43, changePercent: 0.80 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 178.45, change: 2.10, changePercent: 1.19 },
  { symbol: "BAC", name: "Bank of America Corp.", price: 34.56, change: 0.67, changePercent: 1.97 },
  { symbol: "WFC", name: "Wells Fargo & Company", price: 45.23, change: -0.34, changePercent: -0.75 },
  { symbol: "GS", name: "Goldman Sachs Group Inc.", price: 387.12, change: 4.56, changePercent: 1.19 },
  { symbol: "MS", name: "Morgan Stanley", price: 89.34, change: 1.23, changePercent: 1.39 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.78, change: 0.89, changePercent: 0.57 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 28.45, change: -0.23, changePercent: -0.80 },
  { symbol: "MRNA", name: "Moderna Inc.", price: 67.89, change: 2.34, changePercent: 3.57 },
  { symbol: "ABBV", name: "AbbVie Inc.", price: 145.23, change: 1.45, changePercent: 1.01 },
  { symbol: "TMO", name: "Thermo Fisher Scientific", price: 523.45, change: 7.89, changePercent: 1.53 },
  { symbol: "XOM", name: "Exxon Mobil Corporation", price: 112.34, change: 1.56, changePercent: 1.41 },
  { symbol: "CVX", name: "Chevron Corporation", price: 145.67, change: 2.23, changePercent: 1.55 },
  { symbol: "COP", name: "ConocoPhillips", price: 89.45, change: 1.78, changePercent: 2.03 },
  { symbol: "SLB", name: "Schlumberger NV", price: 45.23, change: 0.89, changePercent: 2.01 },
  { symbol: "HAL", name: "Halliburton Company", price: 32.45, change: 0.67, changePercent: 2.10 },
  { symbol: "KO", name: "The Coca-Cola Company", price: 58.34, change: 0.45, changePercent: 0.78 },
  { symbol: "PEP", name: "PepsiCo Inc.", price: 167.23, change: 1.23, changePercent: 0.74 },
  { symbol: "WMT", name: "Walmart Inc.", price: 152.45, change: 0.89, changePercent: 0.59 },
  { symbol: "HD", name: "The Home Depot Inc.", price: 345.67, change: 3.45, changePercent: 1.01 },
  { symbol: "LOW", name: "Lowe's Companies Inc.", price: 234.56, change: 2.34, changePercent: 1.01 },
  { symbol: "TGT", name: "Target Corporation", price: 123.45, change: 1.23, changePercent: 1.01 },
  { symbol: "COST", name: "Costco Wholesale Corporation", price: 567.89, change: 5.67, changePercent: 1.01 },
  { symbol: "NKE", name: "NIKE Inc.", price: 98.76, change: 0.98, changePercent: 1.00 },
  { symbol: "MCD", name: "McDonald's Corporation", price: 287.45, change: 2.87, changePercent: 1.01 },
  { symbol: "SBUX", name: "Starbucks Corporation", price: 87.65, change: 0.87, changePercent: 1.00 },
  { symbol: "DIS", name: "The Walt Disney Company", price: 89.12, change: 0.89, changePercent: 1.01 },
  { symbol: "UBER", name: "Uber Technologies Inc.", price: 67.89, change: 0.67, changePercent: 1.00 },
  { symbol: "LYFT", name: "Lyft Inc.", price: 12.34, change: 0.12, changePercent: 0.98 },
  { symbol: "SPOT", name: "Spotify Technology S.A.", price: 234.56, change: 2.34, changePercent: 1.01 },
  { symbol: "TWTR", name: "Twitter Inc.", price: 45.67, change: 0.45, changePercent: 1.00 },
  { symbol: "SNAP", name: "Snap Inc.", price: 23.45, change: 0.23, changePercent: 0.99 },
  { symbol: "ZM", name: "Zoom Video Communications", price: 78.90, change: 0.78, changePercent: 1.00 },
  { symbol: "ROKU", name: "Roku Inc.", price: 56.78, change: 0.56, changePercent: 1.00 },
  { symbol: "SQ", name: "Block Inc.", price: 67.89, change: 0.67, changePercent: 1.00 },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 78.90, change: 0.78, changePercent: 1.00 },
  { symbol: "V", name: "Visa Inc.", price: 234.56, change: 2.34, changePercent: 1.01 },
  { symbol: "MA", name: "Mastercard Incorporated", price: 345.67, change: 3.45, changePercent: 1.01 },
  { symbol: "AXP", name: "American Express Company", price: 156.78, change: 1.56, changePercent: 1.01 },
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc.", price: 456789.12, change: 4567.89, changePercent: 1.01 },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", price: 304.53, change: 3.04, changePercent: 1.01 }
];

const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Tech Stocks Rally as AI Innovation Drives Market Optimism",
    url: "https://example.com/news/tech-rally",
    time_published: "20241120T143000",
    authors: ["Market Analyst"],
    summary: "Technology stocks surged today as investors showed renewed confidence in artificial intelligence developments and their potential impact on future earnings.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "Financial Times",
    category_within_source: "Technology",
    source_domain: "ft.com",
    topics: [{ topic: "Technology", relevance_score: "0.9" }],
    overall_sentiment_score: 0.7,
    overall_sentiment_label: "Bullish",
    ticker_sentiment: [{ ticker: "AAPL", relevance_score: "0.8", ticker_sentiment_score: "0.6", ticker_sentiment_label: "Bullish" }]
  },
  {
    title: "Federal Reserve Signals Potential Rate Changes in 2024",
    url: "https://example.com/news/fed-rates",
    time_published: "20241120T120000",
    authors: ["Economic Reporter"],
    summary: "The Federal Reserve hinted at possible adjustments to interest rates based on inflation data and economic indicators showing mixed signals.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "Wall Street Journal",
    category_within_source: "Economy",
    source_domain: "wsj.com",
    topics: [{ topic: "Economy", relevance_score: "0.95" }],
    overall_sentiment_score: 0.1,
    overall_sentiment_label: "Neutral",
    ticker_sentiment: [{ ticker: "SPY", relevance_score: "0.7", ticker_sentiment_score: "0.2", ticker_sentiment_label: "Neutral" }]
  },
  {
    title: "Healthcare Sector Shows Strong Growth in Q4 Earnings",
    url: "https://example.com/news/healthcare-earnings",
    time_published: "20241120T100000",
    authors: ["Healthcare Analyst"],
    summary: "Major healthcare companies reported better-than-expected quarterly earnings, driven by pharmaceutical innovations and increased demand for medical services.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "Bloomberg",
    category_within_source: "Healthcare",
    source_domain: "bloomberg.com",
    topics: [{ topic: "Healthcare", relevance_score: "0.9" }],
    overall_sentiment_score: 0.6,
    overall_sentiment_label: "Bullish",
    ticker_sentiment: [{ ticker: "JNJ", relevance_score: "0.8", ticker_sentiment_score: "0.7", ticker_sentiment_label: "Bullish" }]
  },
  {
    title: "Energy Stocks Volatile Amid Changing Oil Prices",
    url: "https://example.com/news/energy-volatility",
    time_published: "20241119T160000",
    authors: ["Energy Market Expert"],
    summary: "Energy sector stocks experienced significant volatility as crude oil prices fluctuated in response to geopolitical tensions and supply chain developments.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "Reuters",
    category_within_source: "Energy",
    source_domain: "reuters.com",
    topics: [{ topic: "Energy", relevance_score: "0.9" }],
    overall_sentiment_score: -0.2,
    overall_sentiment_label: "Bearish",
    ticker_sentiment: [{ ticker: "XOM", relevance_score: "0.9", ticker_sentiment_score: "-0.3", ticker_sentiment_label: "Bearish" }]
  },
  {
    title: "Banking Sector Adapts to Digital Transformation Trends",
    url: "https://example.com/news/banking-digital",
    time_published: "20241119T140000",
    authors: ["Financial Innovation Reporter"],
    summary: "Major banks continue investing in digital infrastructure and fintech partnerships to meet evolving customer expectations and regulatory requirements.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "CNBC",
    category_within_source: "Banking",
    source_domain: "cnbc.com",
    topics: [{ topic: "Banking", relevance_score: "0.85" }],
    overall_sentiment_score: 0.4,
    overall_sentiment_label: "Bullish",
    ticker_sentiment: [{ ticker: "JPM", relevance_score: "0.8", ticker_sentiment_score: "0.5", ticker_sentiment_label: "Bullish" }]
  },
  {
    title: "Cryptocurrency Market Shows Signs of Recovery",
    url: "https://example.com/news/crypto-recovery",
    time_published: "20241119T130000",
    authors: ["Crypto Analyst"],
    summary: "Digital assets gained momentum as institutional investors showed renewed interest in cryptocurrency investments and regulatory clarity improved.",
    banner_image: "https://via.placeholder.com/400x200",
    source: "CoinDesk",
    category_within_source: "Cryptocurrency",
    source_domain: "coindesk.com",
    topics: [{ topic: "Cryptocurrency", relevance_score: "0.9" }],
    overall_sentiment_score: 0.5,
    overall_sentiment_label: "Bullish",
    ticker_sentiment: [{ ticker: "BTC", relevance_score: "0.9", ticker_sentiment_score: "0.6", ticker_sentiment_label: "Bullish" }]
  }
];

export class AlphaVantageService {
  private static async makeApiCall(endpoint: string, params: Record<string, string>) {
    try {
      console.log(`Making API call to ${endpoint} with params:`, params);
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: params
      });

      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error in ${endpoint}:`, error);
      return null;
    }
  }

  static async getAllNYSEStocks(): Promise<AlphaVantageStock[]> {
    // For NASDAQ-only app, return NASDAQ stocks for NYSE calls too
    return this.getAllNASDAQStocks();
  }

  static async getAllNASDAQStocks(): Promise<AlphaVantageStock[]> {
    const data = await this.makeApiCall('finnhub-stocks', {});
    
    if (!data) {
      // Return mock data for development
      return MOCK_STOCKS; // Return all mock stocks
    }

    return data.stocks || [];
  }

  static async getStockQuote(symbol: string): Promise<AlphaVantageStock | null> {
    const data = await this.makeApiCall('finnhub-quote', { symbol });
    
    if (!data) {
      // Return mock data for development
      const mockStock = MOCK_STOCKS.find(stock => stock.symbol === symbol.toUpperCase());
      return mockStock || {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Corporation`,
        price: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5
      };
    }

    return data.stock;
  }

  static async getLatestNews(): Promise<NewsArticle[]> {
    const data = await this.makeApiCall('finnhub-news', {});
    
    if (!data) {
      // Return mock data for development
      return MOCK_NEWS;
    }

    return data.news || [];
  }

  static async getStockNews(tickers: string[] = []): Promise<NewsArticle[]> {
    const data = await this.makeApiCall('finnhub-news', { tickers: tickers.join(',') });
    
    if (!data) {
      // Return filtered mock data for development
      return MOCK_NEWS.filter(news => 
        tickers.length === 0 || 
        news.ticker_sentiment.some(sentiment => 
          tickers.includes(sentiment.ticker)
        )
      );
    }

    return data.news || [];
  }

  static async searchStocks(query: string): Promise<AlphaVantageStock[]> {
    const allStocks = await this.getAllNASDAQStocks();
    
    return allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  static formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  static formatVolume(volume: string): string {
    const num = parseInt(volume);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return volume;
  }
}