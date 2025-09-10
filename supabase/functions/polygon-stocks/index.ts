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

    // Get stock tickers for NYSE and NASDAQ
    const [nasdaqResponse, nyseResponse] = await Promise.all([
      fetch(`https://api.polygon.io/v3/reference/tickers?market=stocks&exchange=XNAS&active=true&limit=1000&apikey=${API_KEY}`),
      fetch(`https://api.polygon.io/v3/reference/tickers?market=stocks&exchange=XNYS&active=true&limit=1000&apikey=${API_KEY}`)
    ]);
    
    if (!nasdaqResponse.ok || !nyseResponse.ok) {
      throw new Error(`Polygon API error: NASDAQ ${nasdaqResponse.status}, NYSE ${nyseResponse.status}`);
    }

    const [nasdaqData, nyseData] = await Promise.all([
      nasdaqResponse.json(),
      nyseResponse.json()
    ]);

    // Combine tickers from both exchanges
    const allTickers = [...(nasdaqData.results || []), ...(nyseData.results || [])];
    
    // Filter for common stocks
    const filteredTickers = allTickers
      .filter((ticker: any) => 
        ticker.type === 'CS' && // Common Stock
        ticker.ticker && 
        !ticker.ticker.includes('.') && 
        !ticker.ticker.includes('-') &&
        ticker.ticker.length <= 6 &&
        ticker.ticker.match(/^[A-Z]+$/)
      )
      .slice(0, 500); // Limit to 500 stocks for performance

    console.log(`Found ${filteredTickers.length} filtered stocks`);

    // Get quotes in batches to avoid rate limits
    const stocks = [];
    const batchSize = 50;
    
    for (let i = 0; i < Math.min(filteredTickers.length, 200); i += batchSize) {
      const batch = filteredTickers.slice(i, i + batchSize);
      const symbols = batch.map(t => t.ticker).join(',');
      
      try {
        // Get previous day's close for all symbols in batch
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split('T')[0];
        
        const quotesResponse = await fetch(
          `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${yesterday}?adjusted=true&apikey=${API_KEY}`
        );
        
        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          
          if (quotesData.results) {
            for (const result of quotesData.results) {
              const ticker = batch.find(t => t.ticker === result.T);
              if (ticker && result.c && result.c > 0) {
                const change = ((result.c - result.o) / result.o) * 100;
                
                stocks.push({
                  symbol: result.T,
                  name: ticker.name || result.T,
                  price: parseFloat(result.c.toFixed(2)),
                  change: parseFloat(change.toFixed(2)),
                  volume: (result.v || 0).toString(),
                  marketCap: ticker.market_cap ? `${(ticker.market_cap / 1000000000).toFixed(1)}B` : 'N/A',
                  peRatio: 'N/A'
                });
              }
            }
          }
        }
        
        // Rate limiting - 5 requests per minute for free tier
        if (i + batchSize < filteredTickers.length) {
          await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds
        }
        
      } catch (error) {
        console.error(`Error fetching batch starting at ${i}:`, error);
        continue;
      }
    }

    console.log(`Successfully fetched data for ${stocks.length} stocks`);

    return new Response(
      JSON.stringify({ stocks }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in polygon-stocks function:', error);
    return new Response(
      JSON.stringify({ error: error.message, stocks: [] }),
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