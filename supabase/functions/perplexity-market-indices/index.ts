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
            content: 'You are a financial data API. Search the web RIGHT NOW for the CURRENT LIVE closing prices and today\'s percentage changes for these market indices:\n\n1. S&P 500 Index (^GSPC)\n2. Dow Jones Industrial Average (^DJI)\n3. Nasdaq Composite (^IXIC)\n\nSearch REAL-TIME data from Yahoo Finance, Google Finance, Bloomberg, or MarketWatch.\n\nYou MUST return ONLY valid JSON with ACTUAL REAL NUMBERS - NO PLACEHOLDERS like "X" or "XX,XXX".\n\nExample of CORRECT format (but use TODAY\'S ACTUAL values):\n{"sp500": {"value": "6,234.56", "change": 1.23}, "dowJones": {"value": "43,567.89", "change": -0.45}, "nasdaq": {"value": "19,876.54", "change": 2.10}}\n\nReturn ONLY the JSON object with today\'s ACTUAL numeric values. No explanations, no placeholders, just real data.'
          }
        ],
        temperature: 0.0,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity raw response:', JSON.stringify(data));
    
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in Perplexity response');
      throw new Error('No content in Perplexity response');
    }

    console.log('Perplexity content before cleaning:', content);

    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Extract just the JSON object - look for the first { and find its matching }
    const firstBrace = content.indexOf('{');
    if (firstBrace === -1) {
      console.error('No JSON object found in content:', content);
      throw new Error('No JSON object found in response');
    }
    
    // Find the matching closing brace for the first opening brace
    let braceCount = 0;
    let jsonEnd = firstBrace;
    for (let i = firstBrace; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') braceCount--;
      if (braceCount === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
    
    const jsonString = content.substring(firstBrace, jsonEnd);
    console.log('Extracted JSON string:', jsonString);
    
    // Parse the JSON response
    const marketData = JSON.parse(jsonString);
    
    // Validate the response has all required fields
    if (!marketData.sp500 || !marketData.dowJones || !marketData.nasdaq) {
      console.error('Missing required fields in market data:', marketData);
      throw new Error('Invalid market data structure');
    }

    console.log('Successfully fetched market indices from Perplexity');

    return new Response(JSON.stringify(marketData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in perplexity-market-indices function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
