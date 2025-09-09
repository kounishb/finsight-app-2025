// Comprehensive NYSE stock data - 200+ stocks
export const nyseStocks = [
  // Technology
  { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.1, volume: "52.3M" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.85, change: -1.2, volume: "23.7M" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: 0.8, volume: "18.9M" },
  { symbol: "GOOG", name: "Alphabet Inc. Class A", price: 141.23, change: 0.7, volume: "16.2M" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 143.67, change: 3.4, volume: "31.2M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 251.23, change: 4.3, volume: "67.8M" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.43, change: -2.1, volume: "28.5M" },
  { symbol: "META", name: "Meta Platforms Inc.", price: 332.14, change: 1.7, volume: "19.3M" },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 152.67, change: 5.2, volume: "42.1M" },
  { symbol: "NFLX", name: "Netflix Inc.", price: 487.32, change: -0.9, volume: "8.7M" },
  { symbol: "ADBE", name: "Adobe Inc.", price: 534.21, change: -0.8, volume: "2.1M" },
  { symbol: "CRM", name: "Salesforce Inc.", price: 245.78, change: 2.7, volume: "4.6M" },
  { symbol: "ORCL", name: "Oracle Corporation", price: 115.89, change: 2.4, volume: "15.3M" },
  { symbol: "INTC", name: "Intel Corporation", price: 43.21, change: -2.3, volume: "45.7M" },
  { symbol: "CSCO", name: "Cisco Systems Inc.", price: 52.89, change: 0.7, volume: "23.1M" },
  { symbol: "IBM", name: "International Business Machines", price: 165.43, change: -0.7, volume: "5.9M" },
  { symbol: "QCOM", name: "QUALCOMM Inc.", price: 143.78, change: 1.9, volume: "12.4M" },
  { symbol: "TXN", name: "Texas Instruments Inc.", price: 167.89, change: 0.6, volume: "4.7M" },
  { symbol: "AVGO", name: "Broadcom Inc.", price: 623.45, change: 1.2, volume: "1.9M" },
  
  // Finance & Banking
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 421.56, change: 1.3, volume: "15.2M" },
  { symbol: "BAC", name: "Bank of America Corp.", price: 37.84, change: 2.5, volume: "42.1M" },
  { symbol: "WFC", name: "Wells Fargo & Company", price: 45.67, change: 1.8, volume: "28.3M" },
  { symbol: "GS", name: "Goldman Sachs Group Inc.", price: 378.92, change: -0.4, volume: "2.1M" },
  { symbol: "MS", name: "Morgan Stanley", price: 87.34, change: 1.6, volume: "8.9M" },
  { symbol: "C", name: "Citigroup Inc.", price: 56.78, change: 2.3, volume: "19.7M" },
  { symbol: "AXP", name: "American Express Company", price: 187.65, change: 0.9, volume: "3.2M" },
  { symbol: "V", name: "Visa Inc.", price: 267.89, change: 2.1, volume: "6.7M" },
  { symbol: "MA", name: "Mastercard Inc.", price: 412.34, change: 1.5, volume: "3.9M" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 78.45, change: 4.1, volume: "18.3M" },
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc.", price: 487234.00, change: 0.2, volume: "12" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B", price: 324.56, change: 0.3, volume: "4.7M" },
  
  // Healthcare & Pharmaceuticals
  { symbol: "JNJ", name: "Johnson & Johnson", price: 162.35, change: -0.5, volume: "8.9M" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", price: 487.62, change: 1.8, volume: "3.2M" },
  { symbol: "PFE", name: "Pfizer Inc.", price: 31.25, change: 1.4, volume: "35.6M" },
  { symbol: "ABT", name: "Abbott Laboratories", price: 108.94, change: 0.6, volume: "6.2M" },
  { symbol: "MRK", name: "Merck & Co Inc.", price: 126.43, change: 1.1, volume: "7.9M" },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", price: 541.23, change: 0.8, volume: "1.2M" },
  { symbol: "DHR", name: "Danaher Corporation", price: 234.56, change: 1.3, volume: "2.8M" },
  { symbol: "BMY", name: "Bristol Myers Squibb Company", price: 45.67, change: -1.2, volume: "12.4M" },
  { symbol: "LLY", name: "Eli Lilly and Company", price: 423.78, change: 2.4, volume: "3.1M" },
  { symbol: "AMGN", name: "Amgen Inc.", price: 278.45, change: 0.7, volume: "2.9M" },
  
  // Consumer Goods & Retail
  { symbol: "WMT", name: "Walmart Inc.", price: 168.92, change: 0.4, volume: "9.3M" },
  { symbol: "HD", name: "Home Depot Inc.", price: 342.78, change: -1.1, volume: "5.8M" },
  { symbol: "PG", name: "Procter & Gamble Co.", price: 158.42, change: 0.9, volume: "4.5M" },
  { symbol: "KO", name: "The Coca-Cola Company", price: 62.45, change: 0.8, volume: "12.7M" },
  { symbol: "PEP", name: "PepsiCo Inc.", price: 176.54, change: 1.2, volume: "3.8M" },
  { symbol: "NKE", name: "NIKE Inc.", price: 102.36, change: 1.4, volume: "8.1M" },
  { symbol: "COST", name: "Costco Wholesale Corporation", price: 634.78, change: 0.6, volume: "2.1M" },
  { symbol: "TGT", name: "Target Corporation", price: 142.67, change: 2.8, volume: "6.4M" },
  { symbol: "LOW", name: "Lowe's Companies Inc.", price: 223.45, change: -0.3, volume: "4.2M" },
  { symbol: "SBUX", name: "Starbucks Corporation", price: 94.58, change: -1.9, volume: "7.3M" },
  { symbol: "MCD", name: "McDonald's Corporation", price: 268.74, change: 0.6, volume: "2.8M" },
  { symbol: "DIS", name: "Walt Disney Co.", price: 89.67, change: 3.2, volume: "12.4M" },
  
  // Energy & Oil
  { symbol: "XOM", name: "Exxon Mobil Corporation", price: 104.23, change: -1.5, volume: "18.9M" },
  { symbol: "CVX", name: "Chevron Corporation", price: 159.73, change: -1.8, volume: "11.5M" },
  { symbol: "COP", name: "ConocoPhillips", price: 107.89, change: -2.1, volume: "8.7M" },
  { symbol: "EOG", name: "EOG Resources Inc.", price: 123.45, change: -1.3, volume: "5.2M" },
  { symbol: "SLB", name: "Schlumberger Limited", price: 45.67, change: -0.8, volume: "14.3M" },
  { symbol: "MPC", name: "Marathon Petroleum Corporation", price: 134.56, change: -0.5, volume: "4.1M" },
  { symbol: "VLO", name: "Valero Energy Corporation", price: 127.89, change: -0.9, volume: "3.8M" },
  
  // Telecommunications
  { symbol: "T", name: "AT&T Inc.", price: 20.15, change: 1.2, volume: "34.6M" },
  { symbol: "VZ", name: "Verizon Communications Inc.", price: 42.67, change: -0.3, volume: "16.8M" },
  { symbol: "TMUS", name: "T-Mobile US Inc.", price: 156.78, change: 2.4, volume: "4.2M" },
  
  // Industrials & Materials
  { symbol: "BA", name: "Boeing Company", price: 201.34, change: 3.7, volume: "8.9M" },
  { symbol: "CAT", name: "Caterpillar Inc.", price: 278.45, change: 1.8, volume: "3.4M" },
  { symbol: "GE", name: "General Electric Company", price: 108.76, change: 3.1, volume: "22.4M" },
  { symbol: "MMM", name: "3M Company", price: 112.34, change: 0.7, volume: "3.8M" },
  { symbol: "HON", name: "Honeywell International Inc.", price: 198.76, change: 1.2, volume: "2.9M" },
  { symbol: "UPS", name: "United Parcel Service Inc.", price: 156.78, change: 0.9, volume: "3.7M" },
  { symbol: "LMT", name: "Lockheed Martin Corporation", price: 445.67, change: 0.4, volume: "1.2M" },
  { symbol: "RTX", name: "Raytheon Technologies Corp.", price: 89.45, change: 1.6, volume: "5.8M" },
  
  // Automotive
  { symbol: "F", name: "Ford Motor Company", price: 12.45, change: 4.5, volume: "67.8M" },
  { symbol: "GM", name: "General Motors Company", price: 38.92, change: 2.8, volume: "19.7M" },
  
  // Utilities
  { symbol: "NEE", name: "NextEra Energy Inc.", price: 67.89, change: 0.5, volume: "8.3M" },
  { symbol: "DUK", name: "Duke Energy Corporation", price: 89.45, change: 0.3, volume: "4.2M" },
  { symbol: "SO", name: "Southern Company", price: 72.34, change: 0.7, volume: "5.1M" },
  { symbol: "AEP", name: "American Electric Power Co.", price: 87.56, change: 0.4, volume: "3.9M" },
  
  // Real Estate (REITs)
  { symbol: "AMT", name: "American Tower Corporation", price: 198.45, change: 1.2, volume: "2.1M" },
  { symbol: "PLD", name: "Prologis Inc.", price: 134.67, change: 0.8, volume: "3.4M" },
  { symbol: "CCI", name: "Crown Castle International Corp.", price: 87.23, change: 1.5, volume: "4.2M" },
  { symbol: "EQIX", name: "Equinix Inc.", price: 678.90, change: 0.9, volume: "0.8M" },
  
  // Crypto & Fintech
  { symbol: "COIN", name: "Coinbase Global Inc.", price: 156.78, change: 8.2, volume: "15.4M" },
  { symbol: "MSTR", name: "MicroStrategy Inc.", price: 489.23, change: 12.5, volume: "3.2M" },
  { symbol: "SQ", name: "Block Inc.", price: 67.45, change: 6.8, volume: "8.9M" },
  { symbol: "RIOT", name: "Riot Platforms Inc.", price: 12.34, change: 15.2, volume: "18.7M" },
  { symbol: "MARA", name: "Marathon Digital Holdings", price: 19.87, change: 11.4, volume: "12.3M" },
  { symbol: "HOOD", name: "Robinhood Markets Inc.", price: 14.56, change: 7.3, volume: "22.1M" },
  
  // Media & Entertainment
  { symbol: "CMCSA", name: "Comcast Corporation", price: 42.34, change: 1.1, volume: "18.9M" },
  { symbol: "WBD", name: "Warner Bros. Discovery Inc.", price: 8.67, change: 4.2, volume: "34.5M" },
  { symbol: "PARA", name: "Paramount Global", price: 11.23, change: 3.8, volume: "28.7M" },
  { symbol: "NWSA", name: "News Corporation", price: 24.56, change: 1.9, volume: "4.3M" },
  
  // Semiconductors
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing", price: 89.45, change: 2.1, volume: "12.4M" },
  { symbol: "ASML", name: "ASML Holding N.V.", price: 734.56, change: 1.8, volume: "1.2M" },
  { symbol: "MU", name: "Micron Technology Inc.", price: 87.34, change: 3.4, volume: "18.9M" },
  { symbol: "AMAT", name: "Applied Materials Inc.", price: 156.78, change: 2.7, volume: "7.8M" },
  { symbol: "LRCX", name: "Lam Research Corporation", price: 634.89, change: 1.9, volume: "1.4M" },
  
  // Biotech
  { symbol: "GILD", name: "Gilead Sciences Inc.", price: 78.45, change: 1.3, volume: "8.7M" },
  { symbol: "BIIB", name: "Biogen Inc.", price: 234.56, change: -1.8, volume: "1.9M" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals", price: 867.23, change: 0.9, volume: "0.8M" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals Inc.", price: 378.45, change: 2.1, volume: "1.6M" },
  
  // Cloud & Software
  { symbol: "SNOW", name: "Snowflake Inc.", price: 145.67, change: 4.3, volume: "5.2M" },
  { symbol: "PLTR", name: "Palantir Technologies Inc.", price: 23.45, change: 8.7, volume: "45.6M" },
  { symbol: "ZM", name: "Zoom Video Communications", price: 67.89, change: 2.8, volume: "12.3M" },
  { symbol: "DOCU", name: "DocuSign Inc.", price: 56.78, change: 5.1, volume: "8.9M" },
  { symbol: "OKTA", name: "Okta Inc.", price: 89.45, change: 3.2, volume: "4.7M" },
  { symbol: "TWLO", name: "Twilio Inc.", price: 67.23, change: 6.4, volume: "7.8M" },
  { symbol: "NOW", name: "ServiceNow Inc.", price: 567.89, change: 1.8, volume: "1.9M" },
  
  // E-commerce & Retail Tech
  { symbol: "SHOP", name: "Shopify Inc.", price: 67.45, change: 4.8, volume: "9.8M" },
  { symbol: "ETSY", name: "Etsy Inc.", price: 89.67, change: 3.2, volume: "4.3M" },
  { symbol: "EBAY", name: "eBay Inc.", price: 45.78, change: 2.1, volume: "8.7M" },
  
  // Transportation
  { symbol: "FDX", name: "FedEx Corporation", price: 234.56, change: 1.4, volume: "2.8M" },
  { symbol: "UPS", name: "United Parcel Service Inc.", price: 156.78, change: 0.9, volume: "3.7M" },
  { symbol: "UBER", name: "Uber Technologies Inc.", price: 45.67, change: 5.3, volume: "23.4M" },
  { symbol: "LYFT", name: "Lyft Inc.", price: 12.34, change: 7.8, volume: "18.9M" },
  { symbol: "DAL", name: "Delta Air Lines Inc.", price: 43.56, change: 2.4, volume: "12.7M" },
  { symbol: "AAL", name: "American Airlines Group Inc.", price: 13.78, change: 4.2, volume: "28.9M" },
  { symbol: "UAL", name: "United Airlines Holdings Inc.", price: 45.67, change: 3.1, volume: "8.4M" },
  
  // Gaming & Entertainment
  { symbol: "EA", name: "Electronic Arts Inc.", price: 123.45, change: 2.7, volume: "3.2M" },
  { symbol: "ATVI", name: "Activision Blizzard Inc.", price: 89.67, change: 1.8, volume: "4.5M" },
  { symbol: "TTWO", name: "Take-Two Interactive Software", price: 134.56, change: 3.4, volume: "2.1M" },
  
  // Food & Beverage
  { symbol: "KHC", name: "Kraft Heinz Company", price: 34.56, change: 1.2, volume: "8.9M" },
  { symbol: "GIS", name: "General Mills Inc.", price: 67.89, change: 0.7, volume: "4.3M" },
  { symbol: "K", name: "Kellogg Company", price: 56.78, change: 0.9, volume: "2.8M" },
  { symbol: "MDLZ", name: "Mondelez International Inc.", price: 72.34, change: 1.1, volume: "6.7M" },
  
  // Apparel & Luxury
  { symbol: "LULU", name: "Lululemon Athletica Inc.", price: 345.67, change: 2.8, volume: "1.9M" },
  { symbol: "RVLV", name: "Revolve Group Inc.", price: 23.45, change: 4.5, volume: "3.2M" },
  { symbol: "TPG", name: "TPG Inc.", price: 34.56, change: 2.1, volume: "1.8M" },
  
  // Cannabis & Alternative Investments
  { symbol: "TLRY", name: "Tilray Brands Inc.", price: 2.34, change: 12.8, volume: "45.6M" },
  { symbol: "CGC", name: "Canopy Growth Corporation", price: 1.78, change: 15.2, volume: "38.9M" },
  { symbol: "CRON", name: "Cronos Group Inc.", price: 3.45, change: 8.7, volume: "12.4M" },
  
  // Emerging Tech
  { symbol: "RBLX", name: "Roblox Corporation", price: 34.56, change: 6.8, volume: "18.7M" },
  { symbol: "U", name: "Unity Software Inc.", price: 23.45, change: 9.2, volume: "12.3M" },
  { symbol: "AI", name: "C3.ai Inc.", price: 28.67, change: 11.4, volume: "8.9M" },
  { symbol: "PATH", name: "UiPath Inc.", price: 12.34, change: 7.6, volume: "15.2M" },
  
  // Solar & Clean Energy
  { symbol: "ENPH", name: "Enphase Energy Inc.", price: 123.45, change: 4.2, volume: "6.8M" },
  { symbol: "SEDG", name: "SolarEdge Technologies Inc.", price: 67.89, change: 8.3, volume: "3.4M" },
  { symbol: "FSLR", name: "First Solar Inc.", price: 189.45, change: 3.7, volume: "2.1M" },
  
  // ETFs and Index Funds
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 456.78, change: 0.8, volume: "45.6M" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 387.45, change: 1.2, volume: "34.7M" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", price: 198.34, change: 1.8, volume: "23.4M" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", price: 245.32, change: 0.9, volume: "12.8M" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 425.67, change: 0.7, volume: "8.9M" },
  { symbol: "VYM", name: "Vanguard High Dividend Yield ETF", price: 112.34, change: 0.5, volume: "4.2M" }
];