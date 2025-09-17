export interface AlphaVantageTopic {
  topic: string;
  relevance_score: string;
}

export interface AlphaVantageTickerSentiment {
  ticker: string;
  relevance_score: string;
  ticker_sentiment_score: string;
  ticker_sentiment_label: string;
}

export interface AlphaVantageNewsArticle {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: AlphaVantageTopic[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: AlphaVantageTickerSentiment[];
}

export interface AlphaVantageNewsResponse {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: AlphaVantageNewsArticle[];
}

export class AlphaVantageNewsService {
  private static readonly API_BASE_URL = 'https://www.alphavantage.co/query';
  private static readonly API_KEY = 'HAKD8K6G93M1K2T4';
  
  // Reliable financial news sources
  private static readonly RELIABLE_SOURCES = [
    'The Wall Street Journal',
    'WSJ',
    'Bloomberg',
    'Reuters',
    'Barron\'s',
    'MarketWatch',
    'Investor\'s Business Daily',
    'IBD',
    'Morningstar News',
    'S&P Global Market Intelligence',
    'FactSet News',
    'Dow Jones Newswires',
    'The New York Times',
    'The Washington Post',
    'Los Angeles Times',
    'USA Today',
    'Chicago Tribune',
    'Boston Globe',
    'San Francisco Chronicle',
    'Dallas Morning News',
    'Miami Herald',
    'NPR',
    'CNBC',
    'CNBC Pro',
    'CNBC Make It',
    'Bloomberg TV U.S.',
    'Fox Business Network',
    'Yahoo Finance Live',
    'Cheddar News',
    'PBS NewsHour',
    'Marketplace',
    'CBS News MoneyWatch',
    'Investopedia',
    'Seeking Alpha',
    'The Motley Fool',
    'Kiplinger',
    'Zacks Investment Research',
    'Value Line',
    'TheStreet',
    'Benzinga',
    'Trading Economics',
    'TipRanks',
    'Yahoo Finance',
    'AP Business',
    'Associated Press',
    'CNN Business',
    'Fortune',
    'Forbes',
    'U.S. News & World Report',
    'Politico',
    'Axios',
    'Insider',
    'Business Insider',
    'Financial Times'
  ];

  private static async makeApiCall(params: Record<string, string>) {
    try {
      const url = new URL(this.API_BASE_URL);
      
      // Add API key and other parameters
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      console.log(`Making Alpha Vantage API call to ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error(`Error calling Alpha Vantage API:`, error);
      throw error;
    }
  }

  static async getLatestNews(): Promise<AlphaVantageNewsArticle[]> {
    try {
      console.log('Fetching latest news from Alpha Vantage API...');
      const data = await this.makeApiCall({
        function: 'NEWS_SENTIMENT',
        apikey: this.API_KEY,
        sort: 'RELEVANCE'
      });

      console.log('API Response:', data);

      // Check if we hit the rate limit
      if (data.Information && data.Information.includes('rate limit')) {
        console.log('API rate limit reached, using mock data');
        return this.getMockNews();
      }

      if (data.feed && Array.isArray(data.feed)) {
        console.log(`Found ${data.feed.length} news articles`);
        return data.feed;
      }

      console.log('No feed data found in API response, using mock data');
      return this.getMockNews();
    } catch (error) {
      console.error('Error fetching latest news from Alpha Vantage:', error);
      console.log('Falling back to mock data');
      // Return mock data for development
      return this.getMockNews();
    }
  }

  private static filterByReliableSources(news: AlphaVantageNewsArticle[]): AlphaVantageNewsArticle[] {
    return news.filter(article => {
      // Check if the source matches any of our reliable sources
      return this.RELIABLE_SOURCES.some(reliableSource => 
        article.source.toLowerCase().includes(reliableSource.toLowerCase()) ||
        article.source_domain.toLowerCase().includes(reliableSource.toLowerCase())
      );
    });
  }

  static async getNewsByTicker(ticker: string): Promise<AlphaVantageNewsArticle[]> {
    try {
      const data = await this.makeApiCall({
        function: 'NEWS_SENTIMENT',
        apikey: this.API_KEY,
        tickers: ticker,
        sort: 'RELEVANCE'
      });

      // Check if we hit the rate limit
      if (data.Information && data.Information.includes('rate limit')) {
        console.log('API rate limit reached, using mock data');
        return this.getMockNews();
      }

      if (data.feed && Array.isArray(data.feed)) {
        return data.feed;
      }

      return this.getMockNews();
    } catch (error) {
      console.error(`Error fetching news for ticker ${ticker} from Alpha Vantage:`, error);
      return [];
    }
  }

  static async searchNews(topics: string[]): Promise<AlphaVantageNewsArticle[]> {
    try {
      const data = await this.makeApiCall({
        function: 'NEWS_SENTIMENT',
        apikey: this.API_KEY,
        topics: topics.join(','),
        sort: 'RELEVANCE'
      });

      // Check if we hit the rate limit
      if (data.Information && data.Information.includes('rate limit')) {
        console.log('API rate limit reached, using mock data');
        return this.getMockNews();
      }

      if (data.feed && Array.isArray(data.feed)) {
        return data.feed;
      }

      return this.getMockNews();
    } catch (error) {
      console.error(`Error searching news with topics "${topics.join(',')}" from Alpha Vantage:`, error);
      return [];
    }
  }

  static formatDate(dateString: string): string {
    try {
      // Alpha Vantage format: 20250917T015641
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
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
      // Alpha Vantage format: 20250917T015641
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
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

  static getSentimentColor(sentimentLabel: string): string {
    switch (sentimentLabel.toLowerCase()) {
      case 'bullish':
        return 'text-green-600';
      case 'somewhat-bullish':
        return 'text-green-500';
      case 'neutral':
        return 'text-gray-600';
      case 'somewhat-bearish':
        return 'text-red-500';
      case 'bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  static getSentimentBadgeVariant(sentimentLabel: string): "default" | "secondary" | "destructive" | "outline" {
    switch (sentimentLabel.toLowerCase()) {
      case 'bullish':
        return 'default';
      case 'somewhat-bullish':
        return 'secondary';
      case 'neutral':
        return 'outline';
      case 'somewhat-bearish':
        return 'destructive';
      case 'bearish':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  // Mock data for development
  private static getMockNews(): AlphaVantageNewsArticle[] {
    return [
      {
        title: "Tech Stocks Rally as AI Innovation Drives Market Optimism",
        url: "https://example.com/news/tech-rally",
        time_published: "20250917T143000",
        authors: ["Market Analyst"],
        summary: "Technology stocks surged today as investors showed renewed confidence in artificial intelligence developments and their potential impact on future earnings.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "Financial Times",
        category_within_source: "Technology",
        source_domain: "ft.com",
        topics: [
          { topic: "Technology", relevance_score: "0.9" },
          { topic: "Financial Markets", relevance_score: "0.8" }
        ],
        overall_sentiment_score: 0.7,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          { ticker: "AAPL", relevance_score: "0.8", ticker_sentiment_score: "0.6", ticker_sentiment_label: "Bullish" },
          { ticker: "MSFT", relevance_score: "0.7", ticker_sentiment_score: "0.5", ticker_sentiment_label: "Somewhat-Bullish" }
        ]
      },
      {
        title: "Federal Reserve Signals Potential Rate Changes in 2024",
        url: "https://example.com/news/fed-rates",
        time_published: "20250917T120000",
        authors: ["Economic Reporter"],
        summary: "The Federal Reserve hinted at possible adjustments to interest rates based on inflation data and economic indicators showing mixed signals.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "The Wall Street Journal",
        category_within_source: "Economy",
        source_domain: "wsj.com",
        topics: [
          { topic: "Economy - Monetary", relevance_score: "0.95" },
          { topic: "Financial Markets", relevance_score: "0.8" }
        ],
        overall_sentiment_score: 0.1,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: [
          { ticker: "SPY", relevance_score: "0.7", ticker_sentiment_score: "0.2", ticker_sentiment_label: "Neutral" }
        ]
      },
      {
        title: "Healthcare Sector Shows Strong Growth in Q4 Earnings",
        url: "https://example.com/news/healthcare-earnings",
        time_published: "20250917T100000",
        authors: ["Healthcare Analyst"],
        summary: "Major healthcare companies reported better-than-expected quarterly earnings, driven by pharmaceutical innovations and increased demand for medical services.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "Bloomberg",
        category_within_source: "Healthcare",
        source_domain: "bloomberg.com",
        topics: [
          { topic: "Life Sciences", relevance_score: "0.9" },
          { topic: "Earnings", relevance_score: "0.8" }
        ],
        overall_sentiment_score: 0.6,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          { ticker: "JNJ", relevance_score: "0.8", ticker_sentiment_score: "0.7", ticker_sentiment_label: "Bullish" },
          { ticker: "PFE", relevance_score: "0.6", ticker_sentiment_score: "0.5", ticker_sentiment_label: "Somewhat-Bullish" }
        ]
      },
      {
        title: "Market Volatility Continues as Investors Await Fed Decision",
        url: "https://example.com/news/market-volatility",
        time_published: "20250917T090000",
        authors: ["CNBC Reporter"],
        summary: "Stock markets showed continued volatility as investors awaited the Federal Reserve's upcoming interest rate decision and economic outlook.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "CNBC",
        category_within_source: "Markets",
        source_domain: "cnbc.com",
        topics: [
          { topic: "Financial Markets", relevance_score: "0.9" },
          { topic: "Economy - Monetary", relevance_score: "0.8" }
        ],
        overall_sentiment_score: -0.2,
        overall_sentiment_label: "Somewhat-Bearish",
        ticker_sentiment: [
          { ticker: "SPY", relevance_score: "0.9", ticker_sentiment_score: "-0.3", ticker_sentiment_label: "Somewhat-Bearish" },
          { ticker: "QQQ", relevance_score: "0.7", ticker_sentiment_score: "-0.2", ticker_sentiment_label: "Somewhat-Bearish" }
        ]
      },
      {
        title: "Crypto Market Shows Signs of Recovery",
        url: "https://example.com/news/crypto-recovery",
        time_published: "20250917T080000",
        authors: ["Crypto Analyst"],
        summary: "Digital assets gained momentum as institutional investors showed renewed interest in cryptocurrency investments and regulatory clarity improved.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "CoinDesk",
        category_within_source: "Cryptocurrency",
        source_domain: "coindesk.com",
        topics: [
          { topic: "Blockchain", relevance_score: "0.9" },
          { topic: "Financial Markets", relevance_score: "0.7" }
        ],
        overall_sentiment_score: 0.5,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          { ticker: "BTC", relevance_score: "0.9", ticker_sentiment_score: "0.6", ticker_sentiment_label: "Bullish" }
        ]
      },
      {
        title: "Energy Sector Faces Headwinds as Oil Prices Decline",
        url: "https://example.com/news/energy-decline",
        time_published: "20250917T070000",
        authors: ["Energy Reporter"],
        summary: "Energy sector stocks experienced significant pressure as crude oil prices fell amid concerns about global demand and supply chain developments.",
        banner_image: "https://via.placeholder.com/400x200",
        source: "Reuters",
        category_within_source: "Energy",
        source_domain: "reuters.com",
        topics: [
          { topic: "Energy & Transportation", relevance_score: "0.9" },
          { topic: "Financial Markets", relevance_score: "0.8" }
        ],
        overall_sentiment_score: -0.3,
        overall_sentiment_label: "Somewhat-Bearish",
        ticker_sentiment: [
          { ticker: "XOM", relevance_score: "0.9", ticker_sentiment_score: "-0.3", ticker_sentiment_label: "Somewhat-Bearish" }
        ]
      }
    ];
  }
}
