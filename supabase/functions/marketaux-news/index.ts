import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('MARKETAUX_API_KEY');
    if (!API_KEY) {
      console.log('Marketaux API key not configured, returning mock data');
      // Return mock financial news
      const mockNews = [
        {
          title: "Federal Reserve Considers Interest Rate Adjustments Amid Economic Indicators",
          url: "https://example.com/fed-rates-2024",
          time_published: new Date().toISOString(),
          authors: ["Financial News Team"],
          summary: "The Federal Reserve is evaluating potential changes to interest rates as new economic data suggests shifts in inflation trends and employment figures.",
          banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
          source: "MarketWatch",
          category_within_source: "Federal Reserve",
          source_domain: "marketwatch.com",
          topics: [{ topic: "Monetary Policy", relevance_score: "0.95" }],
          overall_sentiment_score: 0.1,
          overall_sentiment_label: "Neutral",
          ticker_sentiment: [{ ticker: "SPY", relevance_score: "0.8", ticker_sentiment_score: "0.2", ticker_sentiment_label: "Neutral" }]
        },
        {
          title: "Technology Sector Shows Resilience in Q4 Earnings Season",
          url: "https://example.com/tech-earnings-q4",
          time_published: new Date(Date.now() - 3600000).toISOString(),
          authors: ["Tech Industry Analyst"],
          summary: "Major technology companies are reporting stronger than expected quarterly results, driven by cloud computing growth and AI investments.",
          banner_image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
          source: "Bloomberg Technology",
          category_within_source: "Earnings",
          source_domain: "bloomberg.com",
          topics: [{ topic: "Technology Earnings", relevance_score: "0.9" }],
          overall_sentiment_score: 0.7,
          overall_sentiment_label: "Bullish",
          ticker_sentiment: [{ ticker: "AAPL", relevance_score: "0.9", ticker_sentiment_score: "0.8", ticker_sentiment_label: "Bullish" }]
        },
        {
          title: "Energy Markets React to Global Supply Chain Updates",
          url: "https://example.com/energy-markets",
          time_published: new Date(Date.now() - 7200000).toISOString(),
          authors: ["Energy Correspondent"],
          summary: "Oil prices fluctuate as OPEC announces production targets while renewable energy investments reach record highs.",
          banner_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
          source: "Reuters",
          category_within_source: "Energy",
          source_domain: "reuters.com",
          topics: [{ topic: "Energy Markets", relevance_score: "0.85" }],
          overall_sentiment_score: 0.2,
          overall_sentiment_label: "Neutral",
          ticker_sentiment: [{ ticker: "XLE", relevance_score: "0.75", ticker_sentiment_score: "0.3", ticker_sentiment_label: "Neutral" }]
        },
        {
          title: "Healthcare Stocks Surge on Breakthrough Drug Approvals",
          url: "https://example.com/healthcare-surge",
          time_published: new Date(Date.now() - 10800000).toISOString(),
          authors: ["Healthcare Reporter"],
          summary: "Pharmaceutical companies see significant gains following FDA approval of innovative treatments for chronic conditions.",
          banner_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop",
          source: "CNBC",
          category_within_source: "Healthcare",
          source_domain: "cnbc.com",
          topics: [{ topic: "Healthcare", relevance_score: "0.92" }],
          overall_sentiment_score: 0.8,
          overall_sentiment_label: "Bullish",
          ticker_sentiment: [{ ticker: "XLV", relevance_score: "0.88", ticker_sentiment_score: "0.75", ticker_sentiment_label: "Bullish" }]
        },
        {
          title: "Consumer Spending Patterns Shift in Latest Economic Report",
          url: "https://example.com/consumer-spending",
          time_published: new Date(Date.now() - 14400000).toISOString(),
          authors: ["Economic Analysis Team"],
          summary: "New data reveals changing consumer preferences with increased focus on essential goods and digital services.",
          banner_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
          source: "Wall Street Journal",
          category_within_source: "Consumer Trends",
          source_domain: "wsj.com",
          topics: [{ topic: "Consumer Economics", relevance_score: "0.87" }],
          overall_sentiment_score: 0.15,
          overall_sentiment_label: "Neutral",
          ticker_sentiment: [{ ticker: "XLY", relevance_score: "0.82", ticker_sentiment_score: "0.25", ticker_sentiment_label: "Neutral" }]
        },
        {
          title: "Banking Sector Adapts to Digital Transformation Trends",
          url: "https://example.com/banking-digital",
          time_published: new Date(Date.now() - 18000000).toISOString(),
          authors: ["Banking Industry Expert"],
          summary: "Major financial institutions accelerate digital banking initiatives while maintaining traditional service channels.",
          banner_image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=200&fit=crop",
          source: "Financial Times",
          category_within_source: "Banking",
          source_domain: "ft.com",
          topics: [{ topic: "Banking Technology", relevance_score: "0.91" }],
          overall_sentiment_score: 0.5,
          overall_sentiment_label: "Bullish",
          ticker_sentiment: [{ ticker: "XLF", relevance_score: "0.84", ticker_sentiment_score: "0.55", ticker_sentiment_label: "Bullish" }]
        },
        {
          title: "Global Trade Dynamics Influence Market Sentiment",
          url: "https://example.com/global-trade",
          time_published: new Date(Date.now() - 21600000).toISOString(),
          authors: ["International Trade Reporter"],
          summary: "New trade agreements and tariff adjustments create both opportunities and challenges for multinational corporations.",
          banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop",
          source: "Bloomberg",
          category_within_source: "International Trade",
          source_domain: "bloomberg.com",
          topics: [{ topic: "Global Trade", relevance_score: "0.89" }],
          overall_sentiment_score: -0.1,
          overall_sentiment_label: "Neutral",
          ticker_sentiment: []
        },
        {
          title: "Real Estate Market Shows Mixed Signals Across Regions",
          url: "https://example.com/real-estate",
          time_published: new Date(Date.now() - 25200000).toISOString(),
          authors: ["Real Estate Analyst"],
          summary: "Housing markets vary significantly by location with urban areas experiencing different trends than suburban markets.",
          banner_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
          source: "MarketWatch",
          category_within_source: "Real Estate",
          source_domain: "marketwatch.com",
          topics: [{ topic: "Real Estate", relevance_score: "0.86" }],
          overall_sentiment_score: 0.0,
          overall_sentiment_label: "Neutral",
          ticker_sentiment: [{ ticker: "XLRE", relevance_score: "0.79", ticker_sentiment_score: "0.1", ticker_sentiment_label: "Neutral" }]
        }
      ];
      
      return new Response(
        JSON.stringify({ news: mockNews }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const { tickers } = await req.json().catch(() => ({}));

    console.log('Fetching financial news from Marketaux API...');

    // Build Marketaux API URL
    let apiUrl = `https://api.marketaux.com/v1/news/all?api_token=${API_KEY}&limit=100&language=en&sort=published_desc`;
    
    // Add symbols filter if provided
    if (tickers && tickers.trim()) {
      apiUrl += `&symbols=${tickers}`;
    }
    
    // Add filter for financial news
    apiUrl += '&filter_entities=true';

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Marketaux API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from Marketaux API');
    }

    console.log(`Successfully fetched ${data.data.length} news articles from Marketaux`);

    // Transform Marketaux data to match our NewsArticle interface
    const transformedNews = data.data.map((article: any) => ({
      title: article.title || 'Untitled',
      url: article.url || '#',
      time_published: article.published_at || new Date().toISOString(),
      authors: article.source ? [article.source] : ['Unknown'],
      summary: article.description || article.snippet || 'No description available',
      banner_image: article.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
      source: article.source || 'Marketaux',
      category_within_source: article.categories?.[0] || 'Financial News',
      source_domain: article.url ? new URL(article.url).hostname : 'marketaux.com',
      topics: article.categories ? article.categories.map((cat: string) => ({ 
        topic: cat, 
        relevance_score: "0.8" 
      })) : [{ topic: "Financial News", relevance_score: "0.8" }],
      overall_sentiment_score: article.sentiment || 0,
      overall_sentiment_label: article.sentiment > 0.2 ? "Bullish" : article.sentiment < -0.2 ? "Bearish" : "Neutral",
      ticker_sentiment: article.entities ? article.entities
        .filter((entity: any) => entity.symbol)
        .map((entity: any) => ({
          ticker: entity.symbol,
          relevance_score: (entity.relevance_score || 0.5).toString(),
          ticker_sentiment_score: (entity.sentiment_score || 0).toString(),
          ticker_sentiment_label: entity.sentiment_score > 0.2 ? "Bullish" : 
                                 entity.sentiment_score < -0.2 ? "Bearish" : "Neutral"
        })) : []
    }));

    return new Response(
      JSON.stringify({ news: transformedNews }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in marketaux-news function:', error instanceof Error ? error.message : error);
    
    // Return fallback mock data on error
    const fallbackNews = [
      {
        title: "Market Analysis: Key Economic Indicators to Watch This Week",
        url: "https://example.com/market-analysis",
        time_published: new Date().toISOString(),
        authors: ["Market Research Team"],
        summary: "Investors are closely monitoring upcoming economic data releases including employment figures, inflation metrics, and corporate earnings reports.",
        banner_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop",
        source: "Financial Times",
        category_within_source: "Market Analysis",
        source_domain: "ft.com",
        topics: [{ topic: "Market Analysis", relevance_score: "0.9" }],
        overall_sentiment_score: 0.3,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      }
    ];

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        news: fallbackNews 
      }),
      { 
        status: 200, // Return 200 with fallback data
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})