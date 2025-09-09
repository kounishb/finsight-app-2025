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
    const API_KEY = Deno.env.get('FINNHUB_API_KEY');
    if (!API_KEY) {
      throw new Error('Finnhub API key not configured');
    }

    // Get ALL NASDAQ stock symbols
    const symbolsResponse = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=NASDAQ&token=${API_KEY}`);
    
    if (!symbolsResponse.ok) {
      throw new Error(`Finnhub API error: ${symbolsResponse.status}`);
    }

    const symbolsData = await symbolsResponse.json();
    
    // Filter for common stocks only (but keep ALL NASDAQ stocks)
    const allNasdaqStocks = symbolsData
      .filter((stock: any) => 
        stock.type === 'Common Stock' && 
        stock.symbol && 
        !stock.symbol.includes('.') && 
        !stock.symbol.includes('-') && // Avoid preferred shares
        stock.symbol.length <= 6
      );

    console.log(`Found ${allNasdaqStocks.length} NASDAQ stocks total`);

    const stocks = [];
    
    // Process ALL stocks but with rate limiting for free tier
    // Free tier: 60 calls/minute, so we can do about 50 calls safely
    const batchSize = 50;
    const processed = Math.min(allNasdaqStocks.length, batchSize);
    
    console.log(`Processing first ${processed} NASDAQ stocks`);
    
    for (let i = 0; i < processed; i++) {
      const stock = allNasdaqStocks[i];
      
      try {
        // Get quote data
        const quoteResponse = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${API_KEY}`
        );
        
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json();
          
          if (quoteData.c && quoteData.c > 0) {
            const changePercent = quoteData.dp || 0;
            
            stocks.push({
              symbol: stock.symbol,
              name: stock.description || stock.displaySymbol || stock.symbol,
              price: parseFloat(quoteData.c.toFixed(2)),
              change: parseFloat(changePercent.toFixed(2)),
              volume: (quoteData.v || 0).toString(),
              marketCap: 'N/A',
              peRatio: 'N/A'
            });
          }
        }
        
        // Rate limiting - 1.2 seconds between calls to stay within 60/minute limit
        if (i < processed - 1) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
        
      } catch (error) {
        console.error(`Error fetching quote for ${stock.symbol}:`, error);
        continue;
      }
    }

    // Log information about remaining stocks for future enhancement
    if (allNasdaqStocks.length > batchSize) {
      console.log(`Note: ${allNasdaqStocks.length - batchSize} more NASDAQ stocks available. Consider implementing pagination or caching.`);
    }

    console.log(`Fetched data for ${stocks.length} stocks`);

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
    console.error('Error in finnhub-stocks function:', error);
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