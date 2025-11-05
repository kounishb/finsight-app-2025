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
    const body = await req.json().catch(() => ({}));
    const { tickers = [] } = body;

    const API_KEY = Deno.env.get('FINNHUB_API_KEY');
    if (!API_KEY) {
      throw new Error('Finnhub API key not configured');
    }

    let newsData = [];

    if (tickers.length > 0) {
      // Get company-specific news for each ticker
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 7 days
      
      const newsPromises = tickers.slice(0, 10).map(async (ticker: string) => {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${API_KEY}`
          );
          if (response.ok) {
            const companyNews = await response.json();
            return companyNews.slice(0, 5); // Get 5 articles per ticker
          }
          return [];
        } catch (error) {
          console.error(`Error fetching news for ${ticker}:`, error);
          return [];
        }
      });

      const allCompanyNews = await Promise.all(newsPromises);
      newsData = allCompanyNews.flat();
    } else {
      // Get general market news
      const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      newsData = await response.json();
    }

    // Filter for financial content only and format news articles
    const financialKeywords = [
      'stock', 'stocks', 'market', 'trading', 'investment', 'investor', 'financial', 'finance', 'economy', 'economic',
      'earnings', 'revenue', 'profit', 'loss', 'nasdaq', 'nyse', 'dow', 's&p', 'sp500', 'federal reserve', 'fed',
      'interest rate', 'inflation', 'gdp', 'unemployment', 'job', 'employment', 'consumer', 'retail', 'bank', 'banking',
      'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'merger', 'acquisition', 'ipo', 'dividend', 'bond', 'commodity',
      'oil', 'gold', 'currency', 'dollar', 'euro', 'yen', 'treasury', 'yield', 'volatility', 'bull', 'bear', 'analyst',
      'forecast', 'outlook', 'guidance', 'sec', 'regulation', 'policy', 'corporate', 'ceo', 'cfo', 'quarterly', 'annual'
    ];

    const news = newsData
      .filter((article: any) => {
        if (!article.headline || !article.summary || !article.url) return false;
        
        // Check if headline or summary contains financial keywords
        const content = (article.headline + ' ' + article.summary).toLowerCase();
        return financialKeywords.some(keyword => content.includes(keyword));
      })
      .slice(0, 50) // Increased from 20 to 50 for more news coverage
      .map((article: any) => ({
        title: article.headline,
        url: article.url,
        time_published: new Date(article.datetime * 1000).toISOString(),
        authors: article.source ? [article.source] : [],
        summary: article.summary,
        banner_image: article.image,
        source: article.source || 'Finnhub',
        category_within_source: article.category || 'General',
        source_domain: new URL(article.url || 'https://finnhub.io').hostname,
        topics: [],
        ticker_sentiment: article.related ? [{ ticker: article.related }] : []
      }));

    console.log(`Fetched ${news.length} news articles`);

    return new Response(
      JSON.stringify({ news }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in finnhub-news function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', news: [] }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})