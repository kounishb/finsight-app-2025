import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { restClient } from 'npm:@polygon.io/client-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    console.log('Fetching stock data from Alpha Vantage API...');

    // Top stocks to fetch
    const popularTickers = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX',
      'AMD', 'CRM', 'ORCL', 'ADBE', 'INTC', 'IBM', 'CSCO', 'JPM',
      'BAC', 'WFC', 'GS', 'MS', 'JNJ', 'PFE', 'ABBV', 'TMO', 'XOM'
    ];

    const stocks = [];

    // Fetch all stocks in parallel with timeout
    const fetchPromises = popularTickers.map(async (ticker) => {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
        
        const response = await Promise.race([
          fetch(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]) as Response;

        const data = await response.json();
        const quote = data['Global Quote'];
        
        if (quote && quote['05. price']) {
          const price = parseFloat(quote['05. price']);
          const change = parseFloat(quote['09. change']);
          const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || '0');
          
          return {
            symbol: ticker,
            name: `${ticker} Corporation`,
            price: parseFloat(price.toFixed(2)),
            close: parseFloat(price.toFixed(2)),
            change: parseFloat(changePercent.toFixed(2)),
            volume: quote['06. volume'] || '0',
            open: parseFloat(quote['02. open'] || price),
            high: parseFloat(quote['03. high'] || price),
            low: parseFloat(quote['04. low'] || price)
          };
        }
        
        return null;
      } catch (error) {
        console.warn(`Error fetching ${ticker}:`, error.message);
        return null;
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    
    // Add successful results to stocks array
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        stocks.push(result.value);
      }
    });

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