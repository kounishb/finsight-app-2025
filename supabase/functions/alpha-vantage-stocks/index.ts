import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Get NYSE stock listing
    const listingUrl = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${API_KEY}`;
    const listingResponse = await fetch(listingUrl);
    
    if (!listingResponse.ok) {
      throw new Error(`Alpha Vantage API error: ${listingResponse.status}`);
    }

    const listingCsv = await listingResponse.text();
    
    // Parse CSV and filter for NYSE stocks
    const lines = listingCsv.split('\n');
    const headers = lines[0].split(',');
    const stocks = [];

    for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Limit to 1000 for performance
      const row = lines[i].split(',');
      if (row.length >= 3 && row[2]?.includes('NYSE')) {
        const symbol = row[0]?.replace(/"/g, '');
        const name = row[1]?.replace(/"/g, '');
        
        if (symbol && name && symbol.length <= 5) { // Filter out complex symbols
          try {
            // Get real-time quote for each stock
            const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
            const quoteResponse = await fetch(quoteUrl);
            
            if (quoteResponse.ok) {
              const quoteData = await quoteResponse.json();
              const quote = quoteData['Global Quote'];
              
              if (quote && quote['05. price']) {
                const price = parseFloat(quote['05. price']);
                const change = parseFloat(quote['09. change']);
                const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
                const volume = quote['06. volume'];

                stocks.push({
                  symbol,
                  name,
                  price,
                  change: changePercent,
                  volume: volume || '0'
                });
              }
            }
            
            // Rate limiting - Alpha Vantage allows 5 requests per minute for free tier
            await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay
            
          } catch (error) {
            console.log(`Error fetching quote for ${symbol}:`, error);
            continue;
          }
        }
      }
    }

    console.log(`Fetched ${stocks.length} NYSE stocks`);

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
    console.error('Error in alpha-vantage-stocks function:', error);
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