export interface MarketAuxEntity {
  symbol: string;
  name: string;
  exchange: string | null;
  exchange_long: string | null;
  country: string;
  type: string;
  industry: string;
  match_score: number;
  sentiment_score: number;
  highlights: Array<{
    highlight: string;
    sentiment: number;
    highlighted_in: string;
  }>;
}

export interface MarketAuxArticle {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string;
  source: string;
  relevance_score: number | null;
  entities: MarketAuxEntity[];
  similar: any[];
}

export interface MarketAuxResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: MarketAuxArticle[];
}

export class MarketAuxService {
  private static readonly API_BASE_URL = 'https://api.marketaux.com/v1';
  private static readonly API_KEY = import.meta.env.VITE_MARKETAUX_API_KEY;

  private static async makeApiCall(endpoint: string, params: Record<string, string> = {}) {
    try {
      const url = new URL(`${this.API_BASE_URL}${endpoint}`);
      
      // Add API key
      url.searchParams.append('api_token', this.API_KEY);
      
      // Add other parameters
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      console.log(`Making MarketAux API call to ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error calling MarketAux API ${endpoint}:`, error);
      throw error;
    }
  }

  static async getLatestNews(limit: number = 10, page: number = 1): Promise<MarketAuxArticle[]> {
    try {
      const data = await this.makeApiCall('/news/all', {
        limit: limit.toString(),
        page: page.toString(),
        language: 'en',
        countries: 'us',
        sort: 'published_at',
        sort_direction: 'desc'
      });

      return data.data || [];
    } catch (error) {
      console.error('Error fetching latest news from MarketAux:', error);
      // Return mock data for development
      return this.getMockNews();
    }
  }

  static async getNewsBySymbol(symbol: string, limit: number = 10): Promise<MarketAuxArticle[]> {
    try {
      const data = await this.makeApiCall('/news/all', {
        symbols: symbol,
        limit: limit.toString(),
        language: 'en',
        countries: 'us',
        sort: 'published_at',
        sort_direction: 'desc'
      });

      return data.data || [];
    } catch (error) {
      console.error(`Error fetching news for symbol ${symbol} from MarketAux:`, error);
      return [];
    }
  }

  static async searchNews(query: string, limit: number = 10): Promise<MarketAuxArticle[]> {
    try {
      const data = await this.makeApiCall('/news/all', {
        search: query,
        limit: limit.toString(),
        language: 'en',
        countries: 'us',
        sort: 'published_at',
        sort_direction: 'desc'
      });

      return data.data || [];
    } catch (error) {
      console.error(`Error searching news with query "${query}" from MarketAux:`, error);
      return [];
    }
  }

  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  }

  static formatFullDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Mock data for development
  private static getMockNews(): MarketAuxArticle[] {
    return [
      {
        uuid: "mock-1",
        title: "Tech Stocks Rally as AI Innovation Drives Market Optimism",
        description: "Technology stocks surged today as investors showed renewed confidence in artificial intelligence developments and their potential impact on future earnings.",
        keywords: "technology, AI, stocks, market",
        snippet: "Technology stocks surged today as investors showed renewed confidence in artificial intelligence developments...",
        url: "https://example.com/news/tech-rally",
        image_url: "https://via.placeholder.com/400x200",
        language: "en",
        published_at: new Date().toISOString(),
        source: "Financial Times",
        relevance_score: 0.9,
        entities: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            exchange: "NASDAQ",
            exchange_long: "NASDAQ",
            country: "us",
            type: "equity",
            industry: "Technology",
            match_score: 15.5,
            sentiment_score: 0.7,
            highlights: [
              {
                highlight: "Apple Inc. (AAPL) led the rally",
                sentiment: 0.7,
                highlighted_in: "main_text"
              }
            ]
          }
        ],
        similar: []
      },
      {
        uuid: "mock-2",
        title: "Federal Reserve Signals Potential Rate Changes in 2024",
        description: "The Federal Reserve hinted at possible adjustments to interest rates based on inflation data and economic indicators showing mixed signals.",
        keywords: "federal reserve, interest rates, economy",
        snippet: "The Federal Reserve hinted at possible adjustments to interest rates based on inflation data...",
        url: "https://example.com/news/fed-rates",
        image_url: "https://via.placeholder.com/400x200",
        language: "en",
        published_at: new Date(Date.now() - 3600000).toISOString(),
        source: "Wall Street Journal",
        relevance_score: 0.95,
        entities: [
          {
            symbol: "SPY",
            name: "SPDR S&P 500 ETF Trust",
            exchange: "NYSE",
            exchange_long: "New York Stock Exchange",
            country: "us",
            type: "etf",
            industry: "Financial Services",
            match_score: 12.3,
            sentiment_score: 0.1,
            highlights: [
              {
                highlight: "SPY ETF showed mixed signals",
                sentiment: 0.1,
                highlighted_in: "main_text"
              }
            ]
          }
        ],
        similar: []
      }
    ];
  }
}
