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
    let apiUrl = `https://api.marketaux.com/v1/news/all?api_token=${API_KEY}&limit=50&language=en&sort=published_desc`;
    
    // Add symbols filter if provided
    if (tickers && tickers.trim()) {
      apiUrl += `&symbols=${tickers}`;
    }
    
    // Add filter for financial news
    apiUrl += '&filter_entities=true&categories=general,forex,crypto,merger_acquisition';

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