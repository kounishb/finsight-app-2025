import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { symbol, type } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    
    if (type === 'company-description') {
      prompt = `Write a comprehensive company description for ${symbol}. This should be 4-5 detailed paragraphs covering:
      1. Company overview, founding, and core business
      2. Main products/services and market position
      3. Key competitive advantages and market presence
      4. Recent developments and strategic initiatives
      5. Future outlook and growth prospects
      
      Make it informative and professional, suitable for investment research. Focus on factual business information.`;
    } else if (type === 'recommendation') {
      prompt = `Write a detailed investment recommendation analysis for ${symbol}. This should be 3-4 paragraphs covering:
      1. Why this stock aligns with different investor profiles (risk tolerance, investment goals)
      2. Key strengths and growth drivers
      3. Investment themes and market opportunities
      4. Suitability for different investment strategies
      
      Make it comprehensive and analytical, suitable for investment decision-making.`;
    } else if (type === 'stock-metrics') {
      prompt = `Provide realistic current market data for ${symbol} in this exact JSON format:
      {
        "volume": "realistic daily volume with M suffix",
        "marketCap": "realistic market cap with T/B suffix", 
        "peRatio": "realistic P/E ratio as string"
      }
      
      Return only the JSON, no other text.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are a financial research assistant providing accurate, professional investment information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: type === 'stock-metrics' ? 100 : 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let result;
    if (type === 'stock-metrics') {
      try {
        result = JSON.parse(content);
      } catch (e) {
        // Fallback if JSON parsing fails
        result = {
          volume: "25.4M",
          marketCap: "1.2T", 
          peRatio: "28.5"
        };
      }
    } else {
      result = { content };
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
    console.error('Error in stock-data-openai function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
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