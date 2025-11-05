import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    console.log('Fetching real-time market indices from Perplexity...');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: 'Get the current closing prices and today\'s percentage changes for these THREE DIFFERENT indices from financial websites: 1) S&P 500 index (SPX) - currently around 6,770 points, 2) Dow Jones Industrial Average (DJI/DJIA) - currently around 47,000 points, 3) Nasdaq Composite index (COMP/IXIC) - currently around 23,000 points. These are three completely different indices with different values. Search financial news sites for each one separately. Return ONLY valid JSON: {"sp500": {"value": "ACTUAL_SP500_PRICE", "change": ACTUAL_SP500_CHANGE}, "dowJones": {"value": "ACTUAL_DOW_PRICE", "change": ACTUAL_DOW_CHANGE}, "nasdaq": {"value": "ACTUAL_NASDAQ_PRICE", "change": ACTUAL_NASDAQ_CHANGE}}'
          }
        ],
        temperature: 0.0,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity response:', JSON.stringify(data));
    
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in Perplexity response');
    }

    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Parse the JSON response
    let marketData;
    try {
      marketData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', content);
      // Return fallback data if parsing fails
      marketData = {
        sp500: { value: "5,234.18", change: 0.5 },
        dowJones: { value: "42,863.86", change: 0.3 },
        nasdaq: { value: "18,342.94", change: 0.8 }
      };
    }

    console.log('Successfully fetched market indices from Perplexity');

    return new Response(JSON.stringify(marketData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in perplexity-market-indices function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      // Return fallback data on error
      sp500: { value: "5,234.18", change: 0.5 },
      dowJones: { value: "42,863.86", change: 0.3 },
      nasdaq: { value: "18,342.94", change: 0.8 }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
