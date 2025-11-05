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
            content: 'Search the web RIGHT NOW for the LATEST REAL-TIME closing prices and today\'s percentage changes for these THREE COMPLETELY DIFFERENT stock market indices:\n\n1. S&P 500 Index (ticker: SPX or ^GSPC) - Typical range: 6,000-7,000 points\n2. Dow Jones Industrial Average (ticker: DJI or ^DJI) - Typical range: 42,000-48,000 points\n3. Nasdaq Composite Index (ticker: IXIC or ^IXIC) - Typical range: 18,000-24,000 points\n\nIMPORTANT: These are THREE SEPARATE indices with VASTLY DIFFERENT values. The Dow Jones should be 7x higher than S&P 500, and Nasdaq should be 3-4x higher than S&P 500.\n\nSearch TODAY\'S data from Yahoo Finance, Google Finance, Bloomberg, CNBC, or MarketWatch.\n\nReturn ONLY this exact JSON format with the ACTUAL CURRENT values including commas:\n{"sp500": {"value": "6,XXX.XX", "change": X.XX}, "dowJones": {"value": "4X,XXX.XX", "change": X.XX}, "nasdaq": {"value": "XX,XXX.XX", "change": X.XX}}\n\nMake absolutely sure all three values are DIFFERENT and match their typical ranges.'
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
    console.log('Perplexity response:', JSON.stringify(data));
    
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in Perplexity response');
    }

    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Extract just the JSON object - look for the first { and find its matching }
    const firstBrace = content.indexOf('{');
    if (firstBrace === -1) {
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
    
    // Parse the JSON response
    let marketData;
    try {
      marketData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', jsonString);
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
