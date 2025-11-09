import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const symbolSchema = z.string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{1,5}$/, 'Invalid stock symbol format');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    
    // Validate symbol input
    const validatedSymbol = symbolSchema.parse(symbol);

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
    }

    console.log(`Fetching real-time metrics for ${validatedSymbol}`);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: `Search the web RIGHT NOW for the latest real-time stock data for ${validatedSymbol}. Find the most current information from Yahoo Finance, Google Finance, Bloomberg, or MarketWatch.

Return ONLY this exact JSON format with the ACTUAL CURRENT values:
{
  "volume": "XX.XM or XX.XB with proper suffix",
  "marketCap": "X.XXT or XXX.XB with proper suffix",
  "peRatio": "XX.XX or N/A if not available"
}

IMPORTANT:
- Volume should be formatted like "25.4M" for millions or "1.2B" for billions
- Market Cap should be formatted like "1.2T" for trillions or "500.5B" for billions  
- P/E Ratio should be a number like "28.5" or "N/A" if not available
- Search for TODAY's data only
- Make sure the values are accurate and current`
          }
        ],
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status} - ${errorText}`);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log(`Perplexity response for ${validatedSymbol}:`, content);

    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Failed to parse Perplexity response, using fallback:', e);
      // Fallback values
      result = {
        volume: "N/A",
        marketCap: "N/A", 
        peRatio: "N/A"
      };
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in perplexity-stock-metrics function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        volume: "N/A",
        marketCap: "N/A",
        peRatio: "N/A"
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
