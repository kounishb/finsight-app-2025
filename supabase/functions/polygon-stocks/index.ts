import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { restClient } from 'npm:@polygon.io/client-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('POLYGON_API_KEY');
    if (!API_KEY) {
      console.log('Polygon API key not configured, returning mock data');
      const mockStocks = [
        { symbol: "AAPL", name: "Apple Inc.", price: 175.45, change: 2.34, close: 175.45, volume: "45234567" },
        { symbol: "MSFT", name: "Microsoft Corporation", price: 378.92, change: -1.23, close: 378.92, volume: "23456789" },
        { symbol: "GOOGL", name: "Alphabet Inc.", price: 134.87, change: 0.95, close: 134.87, volume: "34567890" },
        { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.32, change: 3.21, close: 145.32, volume: "56789012" },
        { symbol: "NVDA", name: "NVIDIA Corporation", price: 785.43, change: 15.67, close: 785.43, volume: "67890123" }
      ];
      
      return new Response(
        JSON.stringify({ stocks: mockStocks }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('Fetching stock data from Polygon API...');

    // Initialize Polygon client
    const rest = restClient(API_KEY, 'https://api.polygon.io');

    // Limit to top 25 stocks to avoid timeouts
    const popularTickers = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX',
      'AMD', 'CRM', 'ORCL', 'ADBE', 'INTC', 'IBM', 'CSCO', 'JPM',
      'BAC', 'WFC', 'GS', 'MS', 'JNJ', 'PFE', 'ABBV', 'TMO', 'XOM'
    ];

    const stocks = [];
    
    // Get previous trading day with proper formatting
    const getPreviousTradingDay = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      
      // If weekend, go back to Friday
      if (date.getDay() === 0) { // Sunday -> Friday
        date.setDate(date.getDate() - 2);
      } else if (date.getDay() === 6) { // Saturday -> Friday
        date.setDate(date.getDate() - 1);
      }
      
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      
      return formatted;
    };

    const tradingDay = getPreviousTradingDay();
    console.log(`Fetching stock data for date: ${tradingDay}`);

    // Fetch all stocks in parallel with timeout
    const fetchPromises = popularTickers.map(async (ticker) => {
      try {
        const response = await Promise.race([
          rest.reference.stocksDailyOpenClose(ticker, tradingDay),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]) as any;

        if (response && response.close) {
          const change = response.open ? ((response.close - response.open) / response.open) * 100 : 0;
          
          return {
            symbol: ticker,
            name: `${ticker} Corporation`,
            price: parseFloat(response.close.toFixed(2)),
            close: parseFloat(response.close.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            volume: response.volume?.toString() || '0',
            open: response.open || 0,
            high: response.high || 0,
            low: response.low || 0
          };
        }
        
        return null;
      } catch (error) {
        console.warn(`Error fetching ${ticker}:`, error.message);
        return null;
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    
    // Add successful results to stocks array
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        stocks.push(result.value);
      }
    });

    console.log(`Successfully fetched data for ${stocks.length} stocks`);

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
    console.error('Error in polygon-stocks function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', stocks: [] }),
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