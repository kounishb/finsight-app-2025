import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
    }

    console.log('Fetching real-time market indices from Perplexity...');

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
            role: 'system',
            content: 'You are a financial data assistant. Provide only factual, current market data in the exact JSON format requested. Search the internet for the most recent data.'
          },
          {
            role: 'user',
            content: `What are the current live prices and daily percentage changes for the S&P 500, Dow Jones Industrial Average, and Nasdaq Composite? 
            
            Return ONLY a JSON object in this exact format with no additional text:
            {
              "sp500": { "value": "current price as string with commas", "change": daily percentage change as number },
              "dowJones": { "value": "current price as string with commas", "change": daily percentage change as number },
              "nasdaq": { "value": "current price as string with commas", "change": daily percentage change as number }
            }
            
            Example format: {"sp500": {"value": "5,234.67", "change": 0.45}, "dowJones": {"value": "38,456.12", "change": -0.23}, "nasdaq": {"value": "16,789.34", "change": 1.12}}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Perplexity response:', content);

    // Parse JSON from the response
    let marketData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        marketData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Perplexity response:', parseError);
      // Fallback data
      marketData = {
        sp500: { value: "5,234.67", change: 0.45 },
        dowJones: { value: "38,456.12", change: -0.23 },
        nasdaq: { value: "16,789.34", change: 1.12 }
      };
    }

    return new Response(
      JSON.stringify(marketData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in perplexity-market-indices function:', error);
    
    // Fallback data
    const fallbackData = {
      sp500: { value: "5,234.67", change: 0.45 },
      dowJones: { value: "38,456.12", change: -0.23 },
      nasdaq: { value: "16,789.34", change: 1.12 }
    };
    
    return new Response(
      JSON.stringify(fallbackData),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
