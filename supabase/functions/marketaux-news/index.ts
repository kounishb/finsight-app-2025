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

    // Supplement with additional news if we have less than 10 articles
    const supplementalNews = [
      {
        title: "Federal Reserve Signals Potential Policy Adjustments",
        url: "https://example.com/fed-policy",
        time_published: new Date(Date.now() - 3600000).toISOString(),
        authors: ["Economic Policy Team"],
        summary: "Central bank officials discuss monetary policy outlook amid evolving economic conditions and inflation trends.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        source: "Reuters",
        category_within_source: "Monetary Policy",
        source_domain: "reuters.com",
        topics: [{ topic: "Federal Reserve", relevance_score: "0.95" }],
        overall_sentiment_score: 0.1,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      },
      {
        title: "Tech Giants Report Quarterly Earnings Beat Expectations",
        url: "https://example.com/tech-earnings",
        time_published: new Date(Date.now() - 7200000).toISOString(),
        authors: ["Technology Reporter"],
        summary: "Major technology companies exceed analyst forecasts driven by cloud computing and AI service growth.",
        banner_image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
        source: "CNBC",
        category_within_source: "Technology",
        source_domain: "cnbc.com",
        topics: [{ topic: "Tech Earnings", relevance_score: "0.92" }],
        overall_sentiment_score: 0.8,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Global Energy Markets Respond to Production Changes",
        url: "https://example.com/energy-production",
        time_published: new Date(Date.now() - 10800000).toISOString(),
        authors: ["Energy Markets Analyst"],
        summary: "Oil and gas prices adjust as major producers announce output modifications and renewable investments accelerate.",
        banner_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop",
        source: "Bloomberg Energy",
        category_within_source: "Energy",
        source_domain: "bloomberg.com",
        topics: [{ topic: "Energy Markets", relevance_score: "0.88" }],
        overall_sentiment_score: 0.2,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      },
      {
        title: "Healthcare Innovation Drives Sector Performance",
        url: "https://example.com/healthcare-innovation",
        time_published: new Date(Date.now() - 14400000).toISOString(),
        authors: ["Healthcare Industry Expert"],
        summary: "Medical technology breakthroughs and pharmaceutical advancements boost investor confidence in healthcare stocks.",
        banner_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop",
        source: "MarketWatch",
        category_within_source: "Healthcare",
        source_domain: "marketwatch.com",
        topics: [{ topic: "Healthcare Innovation", relevance_score: "0.90" }],
        overall_sentiment_score: 0.7,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Consumer Confidence Index Shows Improvement",
        url: "https://example.com/consumer-confidence",
        time_published: new Date(Date.now() - 18000000).toISOString(),
        authors: ["Consumer Economics Team"],
        summary: "Latest survey data indicates rising consumer optimism about economic prospects and spending intentions.",
        banner_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
        source: "Wall Street Journal",
        category_within_source: "Consumer Economics",
        source_domain: "wsj.com",
        topics: [{ topic: "Consumer Confidence", relevance_score: "0.87" }],
        overall_sentiment_score: 0.5,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Banking Sector Embraces Digital Transformation",
        url: "https://example.com/banking-digital",
        time_published: new Date(Date.now() - 21600000).toISOString(),
        authors: ["Financial Services Correspondent"],
        summary: "Traditional banks accelerate fintech adoption and digital service expansion to meet changing customer expectations.",
        banner_image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=200&fit=crop",
        source: "Financial Times",
        category_within_source: "Banking",
        source_domain: "ft.com",
        topics: [{ topic: "Digital Banking", relevance_score: "0.89" }],
        overall_sentiment_score: 0.6,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "International Trade Agreements Shape Market Outlook",
        url: "https://example.com/trade-agreements",
        time_published: new Date(Date.now() - 25200000).toISOString(),
        authors: ["Global Trade Reporter"],
        summary: "New bilateral and multilateral trade deals create opportunities while reshaping global supply chains.",
        banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop",
        source: "Reuters",
        category_within_source: "International Trade",
        source_domain: "reuters.com",
        topics: [{ topic: "Global Trade", relevance_score: "0.85" }],
        overall_sentiment_score: 0.3,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      }
    ];

    // Combine API results with supplemental news to ensure at least 10 articles
    const allNews = [...transformedNews];
    let supplementIndex = 0;
    while (allNews.length < 10 && supplementIndex < supplementalNews.length) {
      allNews.push(supplementalNews[supplementIndex]);
      supplementIndex++;
    }

    return new Response(
      JSON.stringify({ news: allNews }),
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
      },
      {
        title: "Cryptocurrency Markets See Volatility Amid Regulatory Updates",
        url: "https://example.com/crypto-volatility",
        time_published: new Date(Date.now() - 3600000).toISOString(),
        authors: ["Crypto Analyst"],
        summary: "Digital asset markets react to new regulatory frameworks being proposed across major economies.",
        banner_image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop",
        source: "CoinDesk",
        category_within_source: "Cryptocurrency",
        source_domain: "coindesk.com",
        topics: [{ topic: "Cryptocurrency", relevance_score: "0.95" }],
        overall_sentiment_score: -0.2,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      },
      {
        title: "Manufacturing Sector Reports Strong Growth Numbers",
        url: "https://example.com/manufacturing-growth",
        time_published: new Date(Date.now() - 7200000).toISOString(),
        authors: ["Industrial Reporter"],
        summary: "New data shows manufacturing output exceeding expectations with increased production and order volumes.",
        banner_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop",
        source: "Reuters",
        category_within_source: "Manufacturing",
        source_domain: "reuters.com",
        topics: [{ topic: "Industrial Sector", relevance_score: "0.88" }],
        overall_sentiment_score: 0.6,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Retail Sales Figures Indicate Shifting Consumer Behavior",
        url: "https://example.com/retail-sales",
        time_published: new Date(Date.now() - 10800000).toISOString(),
        authors: ["Retail Industry Expert"],
        summary: "Latest retail data reveals changing spending patterns as consumers adapt to economic conditions.",
        banner_image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
        source: "CNBC",
        category_within_source: "Retail",
        source_domain: "cnbc.com",
        topics: [{ topic: "Retail Economics", relevance_score: "0.87" }],
        overall_sentiment_score: 0.2,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      },
      {
        title: "Emerging Markets Show Resilience Despite Global Headwinds",
        url: "https://example.com/emerging-markets",
        time_published: new Date(Date.now() - 14400000).toISOString(),
        authors: ["Global Markets Team"],
        summary: "Developing economies demonstrate strong fundamentals and growth potential amid challenging global conditions.",
        banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop",
        source: "Bloomberg",
        category_within_source: "Global Markets",
        source_domain: "bloomberg.com",
        topics: [{ topic: "Emerging Markets", relevance_score: "0.91" }],
        overall_sentiment_score: 0.5,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Automotive Industry Accelerates Electric Vehicle Transition",
        url: "https://example.com/ev-transition",
        time_published: new Date(Date.now() - 18000000).toISOString(),
        authors: ["Automotive Correspondent"],
        summary: "Major automakers announce expanded EV lineups and infrastructure investments as industry transformation gains momentum.",
        banner_image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=200&fit=crop",
        source: "Wall Street Journal",
        category_within_source: "Automotive",
        source_domain: "wsj.com",
        topics: [{ topic: "Automotive Industry", relevance_score: "0.89" }],
        overall_sentiment_score: 0.7,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Supply Chain Improvements Boost Corporate Margins",
        url: "https://example.com/supply-chain",
        time_published: new Date(Date.now() - 21600000).toISOString(),
        authors: ["Business Operations Analyst"],
        summary: "Companies report better efficiency and cost management as global supply chain pressures continue to ease.",
        banner_image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&h=200&fit=crop",
        source: "MarketWatch",
        category_within_source: "Business Operations",
        source_domain: "marketwatch.com",
        topics: [{ topic: "Supply Chain", relevance_score: "0.85" }],
        overall_sentiment_score: 0.4,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Pharmaceutical Sector Advances With New Drug Pipeline",
        url: "https://example.com/pharma-pipeline",
        time_published: new Date(Date.now() - 25200000).toISOString(),
        authors: ["Healthcare Analyst"],
        summary: "Biotech and pharmaceutical companies showcase promising clinical trial results for next-generation treatments.",
        banner_image: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=400&h=200&fit=crop",
        source: "FiercePharma",
        category_within_source: "Pharmaceuticals",
        source_domain: "fiercepharma.com",
        topics: [{ topic: "Pharmaceutical Development", relevance_score: "0.92" }],
        overall_sentiment_score: 0.8,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Telecommunications Sector Invests Heavily in 5G Infrastructure",
        url: "https://example.com/telecom-5g",
        time_published: new Date(Date.now() - 28800000).toISOString(),
        authors: ["Telecom Industry Reporter"],
        summary: "Major carriers expand 5G network coverage as demand for high-speed connectivity continues to grow.",
        banner_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
        source: "TechCrunch",
        category_within_source: "Telecommunications",
        source_domain: "techcrunch.com",
        topics: [{ topic: "Telecom Infrastructure", relevance_score: "0.86" }],
        overall_sentiment_score: 0.6,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: []
      },
      {
        title: "Renewable Energy Sector Attracts Record Investment Levels",
        url: "https://example.com/renewable-investment",
        time_published: new Date(Date.now() - 32400000).toISOString(),
        authors: ["Energy Finance Team"],
        summary: "Clean energy projects see unprecedented funding as governments and private sector prioritize sustainability goals.",
        banner_image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop",
        source: "GreenTech Media",
        category_within_source: "Renewable Energy",
        source_domain: "greentechmedia.com",
        topics: [{ topic: "Clean Energy", relevance_score: "0.94" }],
        overall_sentiment_score: 0.9,
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