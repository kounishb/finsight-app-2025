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

    const API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Build news URL
    let newsUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}&limit=50&sort=LATEST`;
    
    // Add specific tickers if provided
    if (tickers.length > 0) {
      const tickerString = tickers.join(',');
      newsUrl += `&tickers=${tickerString}`;
    } else {
      // Get general market news with popular topics
      newsUrl += '&topics=financial_markets,earnings,ipo,mergers_and_acquisitions,technology,economy_fiscal_policy';
    }

    console.log('Fetching news from:', newsUrl.replace(API_KEY, 'API_KEY_HIDDEN'));

    const newsResponse = await fetch(newsUrl);
    
    if (!newsResponse.ok) {
      throw new Error(`Alpha Vantage API error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    
    if (!newsData.feed) {
      console.log('No news feed in response:', newsData);
      return new Response(
        JSON.stringify({ news: [] }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Filter and format news articles
    const news = newsData.feed
      .filter((article: any) => article.title && article.summary && article.url)
      .slice(0, 20) // Limit to 20 articles
      .map((article: any) => ({
        title: article.title,
        url: article.url,
        time_published: article.time_published,
        authors: article.authors || [],
        summary: article.summary,
        banner_image: article.banner_image,
        source: article.source,
        category_within_source: article.category_within_source || 'General',
        source_domain: article.source_domain,
        topics: article.topics || [],
        ticker_sentiment: article.ticker_sentiment || []
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
    console.error('Error in alpha-vantage-news function:', error);
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