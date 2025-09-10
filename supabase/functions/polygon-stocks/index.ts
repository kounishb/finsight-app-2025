import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        { symbol: "AAPL", name: "Apple Inc.", price: 175.45, change: 2.34, volume: "45234567", marketCap: "2.8T", peRatio: "28.5" },
        { symbol: "MSFT", name: "Microsoft Corporation", price: 378.92, change: -1.23, volume: "23456789", marketCap: "2.4T", peRatio: "32.1" },
        { symbol: "GOOGL", name: "Alphabet Inc.", price: 134.87, change: 0.95, volume: "34567890", marketCap: "1.7T", peRatio: "25.3" },
        { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.32, change: 3.21, volume: "56789012", marketCap: "1.5T", peRatio: "45.2" },
        { symbol: "NVDA", name: "NVIDIA Corporation", price: 785.43, change: 15.67, volume: "67890123", marketCap: "1.9T", peRatio: "65.4" }
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

    // Get popular stock tickers - simplified approach
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

    console.log(`Getting data for ${tradingDay}`);

    // Fetch data for popular stocks in smaller batches
    const batchSize = 10;
    for (let i = 0; i < popularTickers.length; i += batchSize) {
      const batch = popularTickers.slice(i, i + batchSize);
      
      try {
        // Get quotes for this batch
        const promises = batch.map(async (ticker) => {
          try {
            const response = await fetch(
              `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${tradingDay}/${tradingDay}?adjusted=true&sort=asc&apikey=${API_KEY}`,
              { 
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(5000) // 5 second timeout
              }
            );

            if (!response.ok) {
              console.warn(`Failed to fetch ${ticker}: ${response.status}`);
              return null;
            }

            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const change = result.o ? ((result.c - result.o) / result.o) * 100 : 0;
              
              return {
                symbol: ticker,
                name: `${ticker} Corporation`, // Simplified name
                price: parseFloat(result.c.toFixed(2)),
                change: parseFloat(change.toFixed(2)),
                volume: result.v?.toString() || '0',
                marketCap: 'N/A',
                peRatio: 'N/A'
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

        // Small delay between batches to avoid rate limits
        if (i + batchSize < popularTickers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
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
      JSON.stringify({ error: error.message, stocks: [] }),
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