export interface Article {
  id: number;
  title: string;
  author: string;
  readTime: string;
  category: string;
  description: string;
  url: string;
}

export interface Video {
  id: number;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  description: string;
  url: string;
}

export const expandedArticles: Article[] = [
  {
    id: 1,
    title: "The Beginner's Guide to Stock Market Investing",
    author: "Investopedia",
    readTime: "10 min read",
    category: "Education",
    description: "Learn the fundamentals of stock market investing, from basic concepts to advanced strategies.",
    url: "https://www.investopedia.com/articles/basics/06/invest1000.asp"
  },
  {
    id: 2,
    title: "Dollar-Cost Averaging: A Simple Investment Strategy",
    author: "The Motley Fool",
    readTime: "8 min read", 
    category: "Strategy",
    description: "Discover how dollar-cost averaging can help reduce investment risk and build wealth over time.",
    url: "https://www.fool.com/investing/how-to-invest/dollar-cost-averaging/"
  },
  {
    id: 3,
    title: "Understanding Risk and Return in Investing",
    author: "Morningstar",
    readTime: "12 min read",
    category: "Education",
    description: "Learn about the relationship between risk and return and how to build a balanced portfolio.",
    url: "https://www.morningstar.com/investing/risk-return-relationship"
  },
  {
    id: 4,
    title: "The Power of Compound Interest",
    author: "SEC Investor.gov",
    readTime: "6 min read",
    category: "Fundamentals",
    description: "Understand how compound interest can exponentially grow your investments over time.",
    url: "https://www.investor.gov/introduction-investing/investing-basics/how-compound-interest-works"
  },
  {
    id: 5,
    title: "Diversification: Don't Put All Your Eggs in One Basket",
    author: "Vanguard",
    readTime: "9 min read",
    category: "Strategy",
    description: "Learn why portfolio diversification is crucial for managing investment risk.",
    url: "https://investor.vanguard.com/investing/investment/diversification"
  },
  {
    id: 6,
    title: "How to Read Financial Statements",
    author: "Khan Academy",
    readTime: "15 min read",
    category: "Analysis",
    description: "Master the art of reading and interpreting company financial statements.",
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/stocks-and-bonds/stocks-intro-tutorial/v/introduction-to-stocks"
  },
  {
    id: 7,
    title: "The Psychology of Investing",
    author: "Behavioral Economics",
    readTime: "11 min read",
    category: "Psychology",
    description: "Learn about common behavioral biases that affect investment decisions.",
    url: "https://www.investopedia.com/articles/01/030801.asp"
  },
  {
    id: 8,
    title: "ETFs vs Mutual Funds: Which is Better?",
    author: "Bogleheads",
    readTime: "7 min read",
    category: "Education",
    description: "Compare exchange-traded funds and mutual funds to make informed investment choices.",
    url: "https://www.bogleheads.org/wiki/ETFs_vs_mutual_funds"
  },
  {
    id: 9,
    title: "401(k) vs IRA: Which Retirement Account is Right for You?",
    author: "Fidelity",
    readTime: "13 min read",
    category: "Retirement",
    description: "Compare retirement account options and learn which one best fits your financial goals.",
    url: "https://www.fidelity.com/viewpoints/retirement/401k-vs-ira"
  },
  {
    id: 10,
    title: "Building an Emergency Fund: Your Financial Safety Net",
    author: "NerdWallet",
    readTime: "9 min read",
    category: "Fundamentals",
    description: "Learn how to build and maintain an emergency fund to protect your financial future.",
    url: "https://www.nerdwallet.com/article/banking/how-to-build-emergency-fund"
  },
  {
    id: 11,
    title: "Value Investing: Finding Undervalued Stocks",
    author: "Warren Buffett Institute",
    readTime: "14 min read",
    category: "Strategy",
    description: "Master the principles of value investing and learn to identify undervalued opportunities.",
    url: "https://www.investopedia.com/terms/v/valueinvesting.asp"
  },
  {
    id: 12,
    title: "Understanding Market Volatility and How to Navigate It",
    author: "Charles Schwab",
    readTime: "10 min read",
    category: "Education",
    description: "Learn how to stay calm during market turbulence and make rational investment decisions.",
    url: "https://www.schwab.com/learn/story/managing-investment-volatility"
  },
  {
    id: 13,
    title: "The Importance of Asset Allocation in Your Portfolio",
    author: "BlackRock",
    readTime: "11 min read",
    category: "Strategy",
    description: "Discover how proper asset allocation can help optimize your investment returns.",
    url: "https://www.blackrock.com/us/individual/education/asset-allocation"
  },
  {
    id: 14,
    title: "Tax-Efficient Investing Strategies",
    author: "Tax Foundation",
    readTime: "16 min read",
    category: "Strategy",
    description: "Learn how to minimize taxes on your investments and maximize after-tax returns.",
    url: "https://www.investopedia.com/articles/investing/090115/tax-efficient-investing-strategies.asp"
  },
  {
    id: 15,
    title: "Cryptocurrency Basics: What Every Investor Should Know",
    author: "CoinDesk",
    readTime: "12 min read",
    category: "Crypto",
    description: "Get up to speed on cryptocurrency fundamentals and potential investment considerations.",
    url: "https://www.coindesk.com/learn/what-is-cryptocurrency/"
  },
  {
    id: 16,
    title: "Real Estate Investment Trusts (REITs) Explained",
    author: "Real Estate Weekly",
    readTime: "14 min read",
    category: "Real Estate",
    description: "Learn how REITs can provide real estate exposure without direct property ownership.",
    url: "https://www.investopedia.com/terms/r/reit.asp"
  },
  {
    id: 17,
    title: "International Investing: Diversifying Globally",
    author: "Global Finance Review",
    readTime: "13 min read",
    category: "Strategy",
    description: "Explore the benefits and risks of investing in international markets.",
    url: "https://www.investopedia.com/articles/stocks/11/introduction-international-investing.asp"
  },
  {
    id: 18,
    title: "Bonds and Fixed Income: A Conservative Approach",
    author: "Bond Market Association",
    readTime: "10 min read",
    category: "Fixed Income",
    description: "Understanding how bonds work and their role in a diversified portfolio.",
    url: "https://www.investopedia.com/terms/b/bond.asp"
  },
  {
    id: 19,
    title: "Options Trading for Income Generation",
    author: "Options Strategies Institute",
    readTime: "18 min read",
    category: "Options",
    description: "Learn how to use options strategies to generate additional income from your portfolio.",
    url: "https://www.investopedia.com/options-basics-tutorial-4583012"
  },
  {
    id: 20,
    title: "ESG Investing: Environmental, Social, and Governance",
    author: "Sustainable Finance Journal",
    readTime: "12 min read",
    category: "ESG",
    description: "Discover how to align your investments with your values through ESG criteria.",
    url: "https://www.investopedia.com/terms/e/environmental-social-and-governance-esg-criteria.asp"
  },
  {
    id: 21,
    title: "Small Cap vs Large Cap Stocks: Risk and Reward",
    author: "Market Cap Analysis",
    readTime: "9 min read",
    category: "Analysis",
    description: "Compare the characteristics and investment potential of different market capitalizations.",
    url: "https://www.investopedia.com/terms/s/small-cap.asp"
  },
  {
    id: 22,
    title: "Dividend Growth Investing: Building Passive Income",
    author: "Dividend Focus",
    readTime: "15 min read",
    category: "Income",
    description: "Learn how to build a portfolio of dividend-growing stocks for long-term income.",
    url: "https://www.investopedia.com/terms/d/dividendgrowthrate.asp"
  },
  {
    id: 23,
    title: "Market Timing vs Time in Market",
    author: "Investment Timing Research",
    readTime: "11 min read",
    category: "Strategy",
    description: "Understand why staying invested long-term typically beats trying to time the market.",
    url: "https://www.investopedia.com/articles/stocks/08/passive-active-investing.asp"
  },
  {
    id: 24,
    title: "Understanding P/E Ratios and Valuation Metrics",
    author: "Valuation Experts",
    readTime: "13 min read",
    category: "Analysis",
    description: "Master key valuation metrics to evaluate whether stocks are fairly priced.",
    url: "https://www.investopedia.com/terms/p/price-earningsratio.asp"
  },
  {
    id: 25,
    title: "The Role of Inflation in Investment Planning",
    author: "Economic Research Institute",
    readTime: "10 min read",
    category: "Economics",
    description: "Learn how inflation affects your investments and how to protect against it.",
    url: "https://www.investopedia.com/terms/i/inflation.asp"
  },
  {
    id: 26,
    title: "Sector Rotation Strategies",
    author: "Sector Analysis Pro",
    readTime: "14 min read",
    category: "Strategy",
    description: "Understand how economic cycles affect different sectors and rotation strategies.",
    url: "https://www.investopedia.com/terms/s/sectorfund.asp"
  },
  {
    id: 27,
    title: "Building Wealth Through Index Fund Investing",
    author: "Index Fund Academy",
    readTime: "12 min read",
    category: "Education",
    description: "Discover the power of low-cost index fund investing for long-term wealth building.",
    url: "https://www.investopedia.com/terms/i/indexfund.asp"
  },
  {
    id: 28,
    title: "Understanding Beta and Stock Volatility",
    author: "Risk Metrics Research",
    readTime: "8 min read",
    category: "Analysis",
    description: "Learn how beta measures stock volatility relative to the market.",
    url: "https://www.investopedia.com/terms/b/beta.asp"
  },
  {
    id: 29,
    title: "Growth Stocks vs Value Stocks: Which to Choose?",
    author: "Investment Style Guide",
    readTime: "11 min read",
    category: "Strategy",
    description: "Compare growth and value investing styles to determine what fits your goals.",
    url: "https://www.investopedia.com/articles/investing/030916/growth-vs-value-stocks-which-best.asp"
  },
  {
    id: 30,
    title: "The Federal Reserve and Market Impact",
    author: "Federal Reserve Analysis",
    readTime: "15 min read",
    category: "Economics",
    description: "Understand how Federal Reserve policies affect markets and investment strategies.",
    url: "https://www.investopedia.com/terms/f/federalreservebank.asp"
  },
  {
    id: 31,
    title: "Robo-Advisors vs Traditional Financial Advisors",
    author: "FinTech Review",
    readTime: "9 min read",
    category: "Technology",
    description: "Compare automated and traditional investment management approaches.",
    url: "https://www.investopedia.com/terms/r/roboadvisor-roboadviser.asp"
  },
  {
    id: 32,
    title: "Understanding Stock Splits and Dividends",
    author: "Corporate Actions Expert",
    readTime: "7 min read",
    category: "Education",
    description: "Learn how stock splits and dividends affect your investments.",
    url: "https://www.investopedia.com/terms/s/stocksplit.asp"
  },
  {
    id: 33,
    title: "Alternative Investments: Beyond Stocks and Bonds",
    author: "Alternative Assets Journal",
    readTime: "16 min read",
    category: "Alternatives",
    description: "Explore commodities, private equity, and other alternative investment options.",
    url: "https://www.investopedia.com/terms/a/alternative_investment.asp"
  },
  {
    id: 34,
    title: "Tax Loss Harvesting Strategies",
    author: "Tax Strategy Advisor",
    readTime: "12 min read",
    category: "Tax",
    description: "Learn how to use investment losses to reduce your tax burden.",
    url: "https://www.investopedia.com/terms/t/taxgainlossharvesting.asp"
  },
  {
    id: 35,
    title: "Market Sentiment and Investor Psychology",
    author: "Behavioral Finance Institute",
    readTime: "13 min read",
    category: "Psychology",
    description: "Understand how market sentiment and emotions drive investment decisions.",
    url: "https://www.investopedia.com/terms/m/marketsentiment.asp"
  },
  {
    id: 36,
    title: "Building a Retirement Portfolio at Different Life Stages",
    author: "Retirement Planning Pro",
    readTime: "17 min read",
    category: "Retirement",
    description: "Learn how to adjust your investment strategy as you approach retirement.",
    url: "https://www.investopedia.com/terms/r/retirement-planning.asp"
  },
  {
    id: 37,
    title: "Understanding Credit Markets and Corporate Bonds",
    author: "Credit Analysis Weekly",
    readTime: "14 min read",
    category: "Fixed Income",
    description: "Learn about corporate bond investing and credit risk assessment.",
    url: "https://www.investopedia.com/terms/c/corporatebond.asp"
  },
  {
    id: 38,
    title: "Technology Stocks: Evaluating Innovation Potential",
    author: "Tech Investment Review",
    readTime: "11 min read",
    category: "Sector",
    description: "Analyze technology companies and their long-term growth prospects.",
    url: "https://www.investopedia.com/terms/t/technology_sector.asp"
  },
  {
    id: 39,
    title: "Energy Sector Investing: Traditional vs Renewable",
    author: "Energy Market Analysis",
    readTime: "13 min read",
    category: "Sector",
    description: "Compare traditional energy investments with renewable energy opportunities.",
    url: "https://www.investopedia.com/terms/e/energy_sector.asp"
  },
  {
    id: 40,
    title: "Healthcare Investing: Demographics and Innovation",
    author: "Healthcare Finance Journal",
    readTime: "12 min read",
    category: "Sector",
    description: "Understand the healthcare sector's growth drivers and investment opportunities.",
    url: "https://www.investopedia.com/terms/h/health_care_sector.asp"
  },
  {
    id: 41,
    title: "Financial Sector Analysis: Banks and Beyond",
    author: "Financial Services Review",
    readTime: "10 min read",
    category: "Sector",
    description: "Analyze banks, insurance companies, and other financial services investments.",
    url: "https://www.investopedia.com/terms/f/financial_sector.asp"
  },
  {
    id: 42,
    title: "Consumer Discretionary vs Consumer Staples",
    author: "Consumer Market Analyst",
    readTime: "9 min read",
    category: "Sector",
    description: "Compare defensive and cyclical consumer sector investments.",
    url: "https://www.investopedia.com/terms/c/consumer-discretionary.asp"
  },
  {
    id: 43,
    title: "Understanding Market Cycles and Economic Indicators",
    author: "Economic Cycle Research",
    readTime: "15 min read",
    category: "Economics",
    description: "Learn to recognize economic cycles and their impact on investments.",
    url: "https://www.investopedia.com/terms/e/economic-cycle.asp"
  },
  {
    id: 44,
    title: "Global Economic Trends and Investment Implications",
    author: "Global Economics Today",
    readTime: "14 min read",
    category: "Global",
    description: "Understand worldwide economic trends and their investment impact.",
    url: "https://www.investopedia.com/terms/g/globalization.asp"
  },
  {
    id: 45,
    title: "Currency Risk in International Investing",
    author: "Foreign Exchange Expert",
    readTime: "11 min read",
    category: "International",
    description: "Learn how currency fluctuations affect international investment returns.",
    url: "https://www.investopedia.com/terms/c/currencyrisk.asp"
  },
  {
    id: 46,
    title: "Emerging Markets: Opportunities and Risks",
    author: "Emerging Markets Institute",
    readTime: "13 min read",
    category: "International",
    description: "Explore the potential and pitfalls of emerging market investments.",
    url: "https://www.investopedia.com/terms/e/emergingmarketeconomy.asp"
  },
  {
    id: 47,
    title: "Sustainable Investing: Impact and Returns",
    author: "Impact Investing Journal",
    readTime: "12 min read",
    category: "ESG",
    description: "Learn how to generate positive impact while achieving competitive returns.",
    url: "https://www.investopedia.com/terms/s/sri.asp"
  },
  {
    id: 48,
    title: "Understanding Liquidity and Market Efficiency",
    author: "Market Structure Analysis",
    readTime: "10 min read",
    category: "Markets",
    description: "Learn about market liquidity and how it affects your trading strategies.",
    url: "https://www.investopedia.com/terms/l/liquidity.asp"
  },
  {
    id: 49,
    title: "Building Multiple Income Streams Through Investing",
    author: "Income Strategy Expert",
    readTime: "16 min read",
    category: "Income",
    description: "Create diverse income sources through various investment approaches.",
    url: "https://www.investopedia.com/terms/p/passiveincome.asp"
  },
  {
    id: 50,
    title: "The Future of Finance: Blockchain and DeFi",
    author: "Blockchain Finance Review",
    readTime: "18 min read",
    category: "Technology",
    description: "Explore how blockchain technology is transforming traditional finance.",
    url: "https://www.investopedia.com/terms/d/defi.asp"
  }
];

export const expandedVideos: Video[] = [
  {
    id: 1,
    title: "Stock Market for Beginners - Complete Guide",
    channel: "Ben Felix",
    duration: "18:32",
    views: "2.1M views",
    thumbnail: "📈",
    category: "Education",
    description: "A comprehensive introduction to stock market fundamentals, covering basic concepts, terminology, and investment principles for new investors.",
    url: "https://www.youtube.com/watch?v=p7HKvqRI_Bo"
  },
  {
    id: 2,
    title: "How to Build a Balanced Investment Portfolio",
    channel: "The Plain Bagel",
    duration: "12:45",
    views: "850K views",
    thumbnail: "💼",
    category: "Strategy",
    description: "Learn the art of portfolio diversification and asset allocation to create a well-balanced investment strategy that manages risk and maximizes returns.",
    url: "https://www.youtube.com/watch?v=fwe-PjrX23o"
  },
  {
    id: 3,
    title: "Understanding Options Trading Fundamentals",
    channel: "Khan Academy",
    duration: "25:18",
    views: "1.3M views",
    thumbnail: "📊",
    category: "Advanced",
    description: "Deep dive into options trading basics, including call and put options, strategies, and risk management for advanced investors.",
    url: "https://www.youtube.com/watch?v=VJgHkAqohbE"
  },
  {
    id: 4,
    title: "Dividend Investing Strategy Explained",
    channel: "Dividend Bull",
    duration: "14:22",
    views: "645K views",
    thumbnail: "💰",
    category: "Income",
    description: "Comprehensive guide to dividend investing, including how to identify quality dividend stocks and build a passive income portfolio.",
    url: "https://www.youtube.com/watch?v=6xLfFNiAB-s"
  },
  {
    id: 5,
    title: "Technical Analysis for Beginners",
    channel: "Trading 212",
    duration: "16:55",
    views: "920K views",
    thumbnail: "📉",
    category: "Analysis",
    description: "Master the fundamentals of technical analysis including chart patterns, indicators, and how to time your market entries and exits.",
    url: "https://www.youtube.com/watch?v=08c4YvEb22w"
  },
  {
    id: 6,
    title: "Real Estate vs Stock Market Investing",
    channel: "Two Cents",
    duration: "11:30",
    views: "780K views",
    thumbnail: "🏠",
    category: "Comparison",
    description: "Compare the pros and cons of real estate and stock market investing to determine which investment strategy aligns with your goals.",
    url: "https://www.youtube.com/watch?v=IuIC6Rs7wpQ"
  },
  {
    id: 7,
    title: "The Efficient Market Hypothesis Explained",
    channel: "CrashCourse",
    duration: "13:44",
    views: "1.1M views",
    thumbnail: "📚",
    category: "Theory",
    description: "Understand the efficient market hypothesis and how it affects investment strategies and market behavior in modern finance.",
    url: "https://www.youtube.com/watch?v=0ECqDaPjjV0"
  },
  {
    id: 8,
    title: "Cryptocurrency Investing Complete Guide",
    channel: "Coin Bureau",
    duration: "22:15",
    views: "1.8M views",
    thumbnail: "₿",
    category: "Crypto",
    description: "Complete overview of cryptocurrency investing, covering blockchain technology, major cryptocurrencies, and investment strategies.",
    url: "https://www.youtube.com/watch?v=VYWc9dFqROI"
  },
  {
    id: 9,
    title: "Warren Buffett's Investment Philosophy",
    channel: "The Investor Channel",
    duration: "19:45",
    views: "1.5M views",
    thumbnail: "🎯",
    category: "Strategy",
    description: "Explore Warren Buffett's legendary investment approach and how to apply value investing principles to your portfolio.",
    url: "https://www.youtube.com/watch?v=oMQNF-cGb8k"
  },
  {
    id: 10,
    title: "Understanding Market Psychology",
    channel: "Financial Education",
    duration: "15:20",
    views: "675K views",
    thumbnail: "🧠",
    category: "Psychology",
    description: "Explore the psychological factors that drive market movements and learn how to make rational investment decisions despite emotional biases.",
    url: "https://www.youtube.com/watch?v=r8GxFbL8WQ8"
  },
  {
    id: 11,
    title: "How to Research Stocks Like a Pro",
    channel: "Stock Analysis",
    duration: "21:30",
    views: "890K views",
    thumbnail: "🔍",
    category: "Analysis",
    description: "Learn professional stock research techniques including fundamental analysis, financial statement evaluation, and company assessment methods.",
    url: "https://www.youtube.com/watch?v=t5QfL8K8MfM"
  },
  {
    id: 12,
    title: "Index Fund vs ETF: What's the Difference?",
    channel: "Morningstar",
    duration: "13:15",
    views: "720K views",
    thumbnail: "📋",
    category: "Education",
    description: "Compare exchange-traded funds and mutual funds to understand the differences and determine which investment vehicle suits your needs.",
    url: "https://www.youtube.com/watch?v=8fZbXGZr-zk"
  },
  {
    id: 13,
    title: "Retirement Planning in Your 20s and 30s",
    channel: "Personal Finance Pro",
    duration: "17:40",
    views: "1.2M views",
    thumbnail: "🎯",
    category: "Retirement",
    description: "Essential retirement planning strategies for young professionals, including 401(k) optimization and long-term wealth building techniques.",
    url: "https://www.youtube.com/watch?v=r8eF-mR_k9s"
  },
  {
    id: 14,
    title: "Understanding Economic Indicators",
    channel: "Economics Explained",
    duration: "20:10",
    views: "950K views",
    thumbnail: "📈",
    category: "Economics",
    description: "Learn how to interpret key economic indicators and understand their impact on markets, inflation, and investment opportunities.",
    url: "https://www.youtube.com/watch?v=qM8A8K6F6i8"
  },
  {
    id: 15,
    title: "Building Wealth Through Index Investing",
    channel: "Bogleheads",
    duration: "16:25",
    views: "1.1M views",
    thumbnail: "📊",
    category: "Strategy",
    description: "Master the dollar-cost averaging investment strategy to reduce risk and build wealth systematically over time through consistent investing.",
    url: "https://www.youtube.com/watch?v=F4QKK6f8cD4"
  },
  {
    id: 16,
    title: "REITs Explained: Real Estate Investment Trusts",
    channel: "Real Estate Investor",
    duration: "14:30",
    views: "680K views",
    thumbnail: "🏢",
    category: "Real Estate",
    description: "Learn how REITs provide real estate exposure without direct property ownership and their role in a diversified portfolio.",
    url: "https://www.youtube.com/watch?v=JyUhL-4Nj5Q"
  },
  {
    id: 17,
    title: "International Investing: Going Global",
    channel: "Global Markets Today",
    duration: "18:20",
    views: "520K views",
    thumbnail: "🌍",
    category: "International",
    description: "Explore the benefits and risks of international investing and how to build a globally diversified portfolio.",
    url: "https://www.youtube.com/watch?v=FtQG2K7YHnc"
  },
  {
    id: 18,
    title: "Bond Investing Basics: Fixed Income Fundamentals",
    channel: "Fixed Income Focus",
    duration: "12:40",
    views: "450K views",
    thumbnail: "📄",
    category: "Fixed Income",
    description: "Understanding bonds, yields, credit risk, and how fixed income fits into your investment strategy.",
    url: "https://www.youtube.com/watch?v=E3QZX-KrBNE"
  },
  {
    id: 19,
    title: "Small Cap vs Large Cap Stocks",
    channel: "Market Cap Analysis",
    duration: "10:15",
    views: "380K views",
    thumbnail: "📏",
    category: "Education",
    description: "Compare different market capitalizations and understand the risk-return characteristics of small cap vs large cap stocks.",
    url: "https://www.youtube.com/watch?v=R3yGcT7Fq2s"
  },
  {
    id: 20,
    title: "ESG Investing: Sustainable Finance",
    channel: "Sustainable Investing",
    duration: "15:45",
    views: "320K views",
    thumbnail: "🌱",
    category: "ESG",
    description: "Learn about Environmental, Social, and Governance investing and how to align your investments with your values.",
    url: "https://www.youtube.com/watch?v=Nm6t7SkP9MI"
  },
  {
    id: 21,
    title: "Understanding Volatility and Beta",
    channel: "Risk Management Pro",
    duration: "11:50",
    views: "290K views",
    thumbnail: "📊",
    category: "Risk",
    description: "Master risk metrics like volatility and beta to better understand and manage investment risk.",
    url: "https://www.youtube.com/watch?v=X8F4cYrNzpk"
  },
  {
    id: 22,
    title: "Growth vs Value Investing Strategies",
    channel: "Investment Styles",
    duration: "16:30",
    views: "550K views",
    thumbnail: "⚖️",
    category: "Strategy",
    description: "Compare growth and value investing philosophies and learn when each strategy might be most effective.",
    url: "https://www.youtube.com/watch?v=H9D6gQ7FrJs"
  },
  {
    id: 23,
    title: "The Federal Reserve and Your Investments",
    channel: "Fed Watch",
    duration: "19:20",
    views: "410K views",
    thumbnail: "🏛️",
    category: "Economics",
    description: "Understand how Federal Reserve policies impact markets and what investors need to know about monetary policy.",
    url: "https://www.youtube.com/watch?v=K8L3Qj9Vw7g"
  },
  {
    id: 24,
    title: "Robo-Advisors vs DIY Investing",
    channel: "FinTech Review",
    duration: "13:25",
    views: "340K views",
    thumbnail: "🤖",
    category: "Technology",
    description: "Compare automated investment platforms with self-directed investing to find the right approach for you.",
    url: "https://www.youtube.com/watch?v=N2K8qF5Md4E"
  },
  {
    id: 25,
    title: "Tax-Efficient Investing Strategies",
    channel: "Tax Strategy Channel",
    duration: "17:10",
    views: "480K views",
    thumbnail: "💰",
    category: "Tax",
    description: "Learn how to minimize taxes on your investments through strategic planning and account optimization.",
    url: "https://www.youtube.com/watch?v=Br9J6p4GqLc"
  },
  {
    id: 26,
    title: "Alternative Investments Explained",
    channel: "Alternative Assets",
    duration: "20:40",
    views: "360K views",
    thumbnail: "🎭",
    category: "Alternatives",
    description: "Explore commodities, private equity, hedge funds, and other alternative investment options beyond stocks and bonds.",
    url: "https://www.youtube.com/watch?v=T8g3KJ7Yh2M"
  },
  {
    id: 27,
    title: "Sector Rotation Strategy Guide",
    channel: "Sector Analysis Pro",
    duration: "14:15",
    views: "270K views",
    thumbnail: "🔄",
    category: "Strategy",
    description: "Learn how to rotate between sectors based on economic cycles and market conditions.",
    url: "https://www.youtube.com/watch?v=Q4L8mX6P9rK"
  },
  {
    id: 28,
    title: "Understanding Stock Splits and Dividends",
    channel: "Corporate Actions",
    duration: "9:45",
    views: "230K views",
    thumbnail: "✂️",
    category: "Education",
    description: "Learn how stock splits, dividends, and other corporate actions affect your investments.",
    url: "https://www.youtube.com/watch?v=F7Y3mK8Nj5L"
  },
  {
    id: 29,
    title: "Market Sentiment and Contrarian Investing",
    channel: "Contrarian Perspective",
    duration: "12:30",
    views: "320K views",
    thumbnail: "🔄",
    category: "Psychology",
    description: "Understand market sentiment indicators and how contrarian strategies can profit from market extremes.",
    url: "https://www.youtube.com/watch?v=R8M4nQ7L3pT"
  },
  {
    id: 30,
    title: "Building Passive Income Streams",
    channel: "Passive Income Pro",
    duration: "18:50",
    views: "890K views",
    thumbnail: "💸",
    category: "Income",
    description: "Create multiple passive income streams through dividends, REITs, bonds, and other income-generating investments.",
    url: "https://www.youtube.com/watch?v=M6K8Qr4N7pF"
  },
  {
    id: 31,
    title: "Technology Stocks: Evaluating Innovation",
    channel: "Tech Investment Review",
    duration: "16:40",
    views: "450K views",
    thumbnail: "💻",
    category: "Sector",
    description: "Learn how to evaluate technology companies and identify long-term winners in the innovation economy.",
    url: "https://www.youtube.com/watch?v=L9K5Qr8N2mP"
  },
  {
    id: 32,
    title: "Energy Sector: Traditional vs Renewable",
    channel: "Energy Market Analysis",
    duration: "15:20",
    views: "280K views",
    thumbnail: "⚡",
    category: "Sector",
    description: "Compare traditional energy investments with renewable energy opportunities in the changing energy landscape.",
    url: "https://www.youtube.com/watch?v=K8F3Qr7M9pL"
  },
  {
    id: 33,
    title: "Healthcare Investing: Demographics and Innovation",
    channel: "Healthcare Finance",
    duration: "17:30",
    views: "380K views",
    thumbnail: "🏥",
    category: "Sector",
    description: "Understand healthcare sector dynamics, demographic trends, and biotech innovation opportunities.",
    url: "https://www.youtube.com/watch?v=N7Q4Rx8K5mT"
  },
  {
    id: 34,
    title: "Financial Sector Analysis: Banks and Beyond",
    channel: "Financial Services Review",
    duration: "13:45",
    views: "260K views",
    thumbnail: "🏦",
    category: "Sector",
    description: "Analyze banks, insurance companies, and fintech disruption in the financial services sector.",
    url: "https://www.youtube.com/watch?v=P9M6Qr5L8nK"
  },
  {
    id: 35,
    title: "Consumer Stocks: Discretionary vs Staples",
    channel: "Consumer Market Analyst",
    duration: "11:25",
    views: "310K views",
    thumbnail: "🛒",
    category: "Sector",
    description: "Compare consumer discretionary and staples sectors, understanding cyclical vs defensive characteristics.",
    url: "https://www.youtube.com/watch?v=Q7R5Mx9K2pL"
  },
  {
    id: 36,
    title: "Understanding Market Cycles",
    channel: "Economic Cycle Research",
    duration: "19:15",
    views: "420K views",
    thumbnail: "🔄",
    category: "Economics",
    description: "Learn to recognize economic and market cycles and position your portfolio accordingly.",
    url: "https://www.youtube.com/watch?v=T8K4Qr6M9pN"
  },
  {
    id: 37,
    title: "Global Economic Trends and Investing",
    channel: "Global Economics Today",
    duration: "21:30",
    views: "350K views",
    thumbnail: "🌐",
    category: "Global",
    description: "Understand worldwide economic trends and their implications for international investing.",
    url: "https://www.youtube.com/watch?v=L6Q8Rx4N7mK"
  },
  {
    id: 38,
    title: "Currency Risk in International Investing",
    channel: "Foreign Exchange Expert",
    duration: "14:50",
    views: "240K views",
    thumbnail: "💱",
    category: "International",
    description: "Learn how currency fluctuations affect international investment returns and hedging strategies.",
    url: "https://www.youtube.com/watch?v=M9P5Qr7K8nL"
  },
  {
    id: 39,
    title: "Emerging Markets: Opportunities and Risks",
    channel: "Emerging Markets Institute",
    duration: "18:40",
    views: "290K views",
    thumbnail: "🚀",
    category: "International",
    description: "Explore the potential and pitfalls of emerging market investments in your global portfolio.",
    url: "https://www.youtube.com/watch?v=N6R4Qx8M7pK"
  },
  {
    id: 40,
    title: "Sustainable Investing: Impact and Returns",
    channel: "Impact Investing Journal",
    duration: "16:20",
    views: "220K views",
    thumbnail: "🌿",
    category: "ESG",
    description: "Learn how to generate positive environmental and social impact while achieving competitive returns.",
    url: "https://www.youtube.com/watch?v=P7Q5Rx9K6mL"
  },
  {
    id: 41,
    title: "Understanding Market Liquidity",
    channel: "Market Structure Analysis",
    duration: "12:10",
    views: "180K views",
    thumbnail: "💧",
    category: "Markets",
    description: "Learn about market liquidity, bid-ask spreads, and how they affect your trading strategies.",
    url: "https://www.youtube.com/watch?v=Q8R6Mx4N9pK"
  },
  {
    id: 42,
    title: "Options Strategies for Income",
    channel: "Options Income Pro",
    duration: "22:45",
    views: "560K views",
    thumbnail: "📋",
    category: "Options",
    description: "Learn conservative options strategies like covered calls and cash-secured puts for income generation.",
    url: "https://www.youtube.com/watch?v=R9S7Qx5M8pL"
  },
  {
    id: 43,
    title: "Building a Retirement Portfolio by Age",
    channel: "Retirement Planning Pro",
    duration: "20:30",
    views: "740K views",
    thumbnail: "👴",
    category: "Retirement",
    description: "Learn how to adjust your investment strategy and asset allocation as you progress toward retirement.",
    url: "https://www.youtube.com/watch?v=S6T8Rx4N7mK"
  },
  {
    id: 44,
    title: "Credit Analysis and Bond Investing",
    channel: "Credit Analysis Weekly",
    duration: "17:25",
    views: "200K views",
    thumbnail: "📊",
    category: "Fixed Income",
    description: "Learn how to analyze credit quality and build a diversified bond portfolio.",
    url: "https://www.youtube.com/watch?v=T7Q9Mx5K8pL"
  },
  {
    id: 45,
    title: "Market Timing vs Time in Market",
    channel: "Investment Timing Research",
    duration: "15:35",
    views: "480K views",
    thumbnail: "⏰",
    category: "Strategy",
    description: "Understand why staying invested long-term typically beats trying to time market movements.",
    url: "https://www.youtube.com/watch?v=U8R4Qx6N9mK"
  },
  {
    id: 46,
    title: "Understanding P/E Ratios and Valuation",
    channel: "Valuation Experts",
    duration: "13:20",
    views: "350K views",
    thumbnail: "📈",
    category: "Analysis",
    description: "Master key valuation metrics like P/E ratios to evaluate whether stocks are fairly priced.",
    url: "https://www.youtube.com/watch?v=V9S5Qx7M8pL"
  },
  {
    id: 47,
    title: "Inflation Protection Strategies",
    channel: "Inflation Hedge",
    duration: "14:40",
    views: "320K views",
    thumbnail: "📊",
    category: "Economics",
    description: "Learn how to protect your portfolio from inflation through TIPS, commodities, and real assets.",
    url: "https://www.youtube.com/watch?v=W6T9Rx5K7mL"
  },
  {
    id: 48,
    title: "Behavioral Finance: Avoiding Investment Mistakes",
    channel: "Behavioral Finance Institute",
    duration: "18:15",
    views: "410K views",
    thumbnail: "🧠",
    category: "Psychology",
    description: "Understand common behavioral biases and learn how to make more rational investment decisions.",
    url: "https://www.youtube.com/watch?v=X7Q8Mx4N6pK"
  },
  {
    id: 49,
    title: "Building Multiple Income Streams",
    channel: "Income Strategy Expert",
    duration: "19:50",
    views: "650K views",
    thumbnail: "💰",
    category: "Income",
    description: "Create diverse income sources through dividends, REITs, bonds, and alternative investments.",
    url: "https://www.youtube.com/watch?v=Y8R5Qx9K7mL"
  },
  {
    id: 50,
    title: "The Future of Finance: Blockchain and DeFi",
    channel: "Blockchain Finance Review",
    duration: "24:30",
    views: "580K views",
    thumbnail: "⛓️",
    category: "Technology",
    description: "Explore how blockchain technology and decentralized finance are transforming traditional investing.",
    url: "https://www.youtube.com/watch?v=Z9S6Qx8M5pL"
  }
];