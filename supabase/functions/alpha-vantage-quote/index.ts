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
    const { symbol } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    // Validate symbol format
    const symbolRegex = /^[A-Z]{1,5}$/;
    const cleanSymbol = symbol.toString().trim().toUpperCase();
    
    if (!symbolRegex.test(cleanSymbol)) {
      return new Response(
        JSON.stringify({ error: 'Invalid symbol format. Must be 1-5 uppercase letters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Get real-time quote
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(cleanSymbol)}&apikey=${API_KEY}`;
    const quoteResponse = await fetch(quoteUrl);
    
    if (!quoteResponse.ok) {
      throw new Error(`Alpha Vantage API error: ${quoteResponse.status}`);
    }

    const quoteData = await quoteResponse.json();
    const quote = quoteData['Global Quote'];
    
    if (!quote || !quote['05. price']) {
      throw new Error('Stock quote not found');
    }

    const stock = {
      symbol: quote['01. symbol'],
      name: symbol, // API doesn't return company name in quote
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: quote['06. volume'] || '0',
      marketCap: 'N/A', // Would need separate API call
      peRatio: 'N/A' // Would need separate API call
    };

    console.log(`Fetched quote for ${symbol}:`, stock);

    return new Response(
      JSON.stringify({ stock }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in alpha-vantage-quote function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
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