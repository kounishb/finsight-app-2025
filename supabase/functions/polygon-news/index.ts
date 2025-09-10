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
    const API_KEY = Deno.env.get('POLYGON_API_KEY');
    if (!API_KEY) {
      throw new Error('Polygon API key not configured');
    }

    const { tickers } = await req.json();

    // Get news from the past 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const fromDate = sevenDaysAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    let newsUrl = `https://api.polygon.io/v2/reference/news?published_utc.gte=${fromDate}&published_utc.lte=${toDate}&order=desc&limit=50&apikey=${API_KEY}`;
    
    // If specific tickers are requested, add them to the query
    if (tickers && tickers.length > 0) {
      const tickerParam = tickers.split(',').slice(0, 10).join(','); // Limit to 10 tickers
      newsUrl += `&ticker=${tickerParam}`;
    }

    const newsResponse = await fetch(newsUrl);
    
    if (!newsResponse.ok) {
      throw new Error(`Polygon API error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    
    if (!newsData.results) {
      throw new Error('No news data found');
    }

    // Transform Polygon news format to match our NewsArticle interface
    const news = newsData.results.map((article: any) => ({
      title: article.title || 'No title',
      url: article.article_url || '',
      time_published: article.published_utc || new Date().toISOString(),
      authors: article.author ? [article.author] : ['Unknown'],
      summary: article.description || 'No summary available',
      banner_image: article.image_url || '',
      source: article.publisher?.name || 'Polygon',
      category_within_source: 'Financial News',
      source_domain: article.publisher?.homepage_url || 'polygon.io',
      topics: article.keywords ? article.keywords.map((keyword: string) => ({
        topic: keyword,
        relevance_score: '0.5'
      })) : [],
      overall_sentiment_score: 0.1,
      overall_sentiment_label: 'Neutral',
      ticker_sentiment: article.tickers ? article.tickers.map((ticker: string) => ({
        ticker,
        relevance_score: '0.7',
        ticker_sentiment_score: '0.1',
        ticker_sentiment_label: 'Neutral'
      })) : []
    }));

    console.log(`Fetched ${news.length} news articles from Polygon`);

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
    console.error('Error in polygon-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message, news: [] }),
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