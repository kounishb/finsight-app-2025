import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surveyData } = await req.json();
    console.log('Generating recommendations for survey data');

    if (!surveyData || typeof surveyData !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Survey data is required and must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize survey data - ensure strings are trimmed and limited in length
    const sanitize = (val: any): string => {
      if (typeof val === 'string') return val.trim().substring(0, 500);
      if (Array.isArray(val)) return val.map(v => String(v).trim().substring(0, 100)).join(', ');
      return String(val).substring(0, 500);
    };

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return getFallbackRecommendations();
    }

    // Create a detailed prompt based on user survey responses
    const prompt = `Based on the following investment profile, recommend 5 specific stocks with detailed explanations:

User Profile:
- Age: ${sanitize(surveyData.age)}
- Investment Experience: ${sanitize(surveyData.experience)}
- Risk Tolerance: ${sanitize(surveyData.riskTolerance)}
- Investment Goals: ${sanitize(surveyData.goals)}
- Time Horizon: ${sanitize(surveyData.timeHorizon)}
- Investment Amount: ${sanitize(surveyData.investmentAmount)}
- Interested Sectors: ${sanitize(surveyData.sectors)}
- Investment Style: ${sanitize(surveyData.investmentStyle)}

For each stock recommendation, provide:
1. Stock symbol (e.g., AAPL)
2. Company name
3. Current approximate price (use realistic 2024 market prices)
4. Brief company description (1-2 sentences about what the company does)
5. Short explanation of why this stock matches their profile (2-3 sentences explaining the key reasons it aligns with their profile)

Return the response in this exact JSON format:
{
  "recommendations": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": "$175.45",
      "description": "Technology company known for iPhone, Mac, and services.",
      "reason": "This stock aligns with your technology sector interest and moderate risk tolerance. Apple's consistent growth and strong brand make it suitable for long-term wealth building goals."
    }
  ]
}

Make sure each recommendation is personalized to their specific profile and includes a disclaimer about consulting financial advisors.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor AI. Provide personalized stock recommendations based on user profiles. Always include a disclaimer about consulting professional financial advisors. Use real stock symbols and realistic current market prices.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 2000,
        
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (response.ok && data.choices && data.choices[0]) {
      try {
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          
          // Don't add disclaimer to each recommendation - it will be shown separately at bottom of page
          
          console.log('Parsed recommendations:', recommendations);
          return new Response(JSON.stringify(recommendations), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
      }
    }

    // Fallback if OpenAI fails
    return getFallbackRecommendations();

  } catch (error) {
    console.error('Error in generate-recommendations function:', error instanceof Error ? error.message : error);
    return getFallbackRecommendations();
  }
});

function getFallbackRecommendations() {
  const fallbackRecommendations = {
    recommendations: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: "$175.45",
        description: "Leading technology company known for innovative consumer electronics and services.",
        reason: "Apple offers a balance of growth and stability, making it suitable for various investment profiles. The company has a strong track record of innovation and consistent returns."
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        price: "$378.92",
        description: "Global technology leader in software, cloud computing, and productivity solutions.",
        reason: "Microsoft's diverse revenue streams and strong position in cloud computing make it a solid long-term investment. The company pays regular dividends and has shown consistent growth."
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: "$134.87",
        description: "Parent company of Google, specializing in internet services and AI technology.",
        reason: "Alphabet dominates the digital advertising market and is investing heavily in AI and cloud technologies. It offers strong growth potential for technology-focused investors."
      },
      {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        price: "$145.32",
        description: "E-commerce and cloud computing giant with diverse business operations.",
        reason: "Amazon's strong position in e-commerce and cloud services (AWS) provides multiple growth avenues. The company continues to innovate across various sectors."
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        price: "$785.43",
        description: "Leading semiconductor company specializing in graphics and AI processing units.",
        reason: "NVIDIA is at the forefront of the AI revolution with its advanced chip technology. While more volatile, it offers significant growth potential for investors comfortable with higher risk."
      }
    ]
  };

  return new Response(JSON.stringify(fallbackRecommendations), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    status: 200
  });
}