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

    const API_KEY = Deno.env.get('FINNHUB_API_KEY');
    if (!API_KEY) {
      throw new Error('Finnhub API key not configured');
    }

    // Get real-time quote and company profile
    const [quoteResponse, profileResponse] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
    ]);
    
    if (!quoteResponse.ok || !profileResponse.ok) {
      throw new Error(`Finnhub API error: ${quoteResponse.status}`);
    }

    const quoteData = await quoteResponse.json();
    const profileData = await profileResponse.json();
    
    if (!quoteData.c) {
      throw new Error('Stock quote not found');
    }

    // Calculate percentage change
    const changePercent = quoteData.dp || 0;

    const stock = {
      symbol: symbol.toUpperCase(),
      name: profileData.name || symbol,
      price: parseFloat(quoteData.c.toFixed(2)),
      change: parseFloat(changePercent.toFixed(2)),
      volume: (quoteData.v || 0).toString(),
      marketCap: profileData.marketCapitalization ? `${(profileData.marketCapitalization / 1000).toFixed(1)}B` : 'N/A',
      peRatio: profileData.peNormalizedAnnual || 'N/A'
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
    console.error('Error in finnhub-quote function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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