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

    // Get ALL NYSE and NASDAQ stock symbols
    const [nasdaqResponse, nyseResponse] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=NASDAQ&token=${API_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=NYSE&token=${API_KEY}`)
    ]);
    
    if (!nasdaqResponse.ok || !nyseResponse.ok) {
      throw new Error(`Finnhub API error: NASDAQ ${nasdaqResponse.status}, NYSE ${nyseResponse.status}`);
    }

    const [nasdaqData, nyseData] = await Promise.all([
      nasdaqResponse.json(),
      nyseResponse.json()
    ]);

    const symbolsData = [...nasdaqData, ...nyseData];
    
    // Filter for common stocks only (keep ALL NYSE and NASDAQ stocks)
    const allStocks = symbolsData
      .filter((stock: any) => 
        stock.type === 'Common Stock' && 
        stock.symbol && 
        !stock.symbol.includes('.') && 
        !stock.symbol.includes('-') && // Avoid preferred shares
        stock.symbol.length <= 6 &&
        stock.symbol.match(/^[A-Z]+$/) // Only letters, no numbers
      );

    console.log(`Found ${allStocks.length} total stocks (NYSE + NASDAQ)`);

    const stocks = [];
    
    // For better performance, process popular stocks first and return more stocks
    // We'll process up to 200 stocks for better coverage
    const batchSize = 200;
    const processed = Math.min(allStocks.length, batchSize);
    
    console.log(`Processing first ${processed} stocks from NYSE and NASDAQ`);
    
    for (let i = 0; i < processed; i++) {
      const stock = allStocks[i];
      
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
        
        // Rate limiting - 0.4 seconds between calls (150/minute limit for paid plans)
        if (i < processed - 1) {
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        
      } catch (error) {
        console.error(`Error fetching quote for ${stock.symbol}:`, error);
        continue;
      }
    }

    // Log information about remaining stocks for future enhancement
    if (allStocks.length > batchSize) {
      console.log(`Note: ${allStocks.length - batchSize} more NYSE/NASDAQ stocks available. Consider implementing pagination or caching.`);
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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', stocks: [] }),
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