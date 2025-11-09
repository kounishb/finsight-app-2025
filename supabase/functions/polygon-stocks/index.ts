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
      // Return some mock data when API key is not configured
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

    // Get popular stock tickers
    const popularTickers = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX',
      'AMD', 'CRM', 'ORCL', 'ADBE', 'INTC', 'IBM', 'CSCO', 'JPM',
      'BAC', 'WFC', 'GS', 'MS', 'JNJ', 'PFE', 'ABBV', 'TMO', 'XOM',
      'CVX', 'KO', 'PEP', 'WMT', 'HD', 'LOW', 'TGT', 'COST', 'NKE',
      'MCD', 'SBUX', 'DIS', 'UBER', 'LYFT', 'SPOT', 'SNAP', 'ZM',
      'SQ', 'PYPL', 'V', 'MA', 'AXP'
    ];

    const stocks = [];
    
    // Get previous trading day
    const date = new Date();
    date.setDate(date.getDate() - 1);
    // If it's weekend, go back to Friday
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() - 1);
    }
    const tradingDay = date.toISOString().split('T')[0];

    console.log(`Getting stock open/close data for ${tradingDay}`);

    // Fetch data for popular stocks in smaller batches
    const batchSize = 5;
    for (let i = 0; i < popularTickers.length; i += batchSize) {
      const batch = popularTickers.slice(i, i + batchSize);
      
      try {
        // Get open/close data for this batch
        const promises = batch.map(async (ticker) => {
          try {
            const response = await rest.getStocksOpenClose({
              stocksTicker: ticker,
              date: tradingDay,
              adjusted: "true"
            });

            if (response && response.close) {
              // Calculate change percentage
              const change = response.open ? ((response.close - response.open) / response.open) * 100 : 0;
              
              return {
                symbol: ticker,
                name: `${ticker} Corporation`, // Simplified name
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

        const results = await Promise.allSettled(promises);
        
        // Add successful results to stocks array
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            stocks.push(result.value);
          }
        });

        // Delay between batches to avoid rate limits
        if (i + batchSize < popularTickers.length) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }

      } catch (error) {
        console.error(`Error processing batch starting at ${i}:`, error);
      }
    }

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