
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinsights } from "@/contexts/FinsightsContext";
import { nyseStocks } from "@/data/nyseStocks";
import { supabase } from "@/integrations/supabase/client";

const mockStockData = {
  "NVDA": {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.43,
    change: 2.1,
    volume: "28.5M",
    marketCap: "$2.15T",
    peRatio: "65.4",
    description: "NVIDIA Corporation is a global leader in accelerated computing and artificial intelligence. Founded in 1993, the company revolutionized the graphics processing industry and has become the dominant force in AI chip technology. NVIDIA's GPUs power everything from gaming and professional visualization to data centers, autonomous vehicles, and robotics. The company's CUDA platform has become the standard for AI development, while their data center business has exploded with the AI boom. NVIDIA also leads in autonomous driving technology through their DRIVE platform, and their gaming segment remains strong with GeForce graphics cards. With a focus on accelerated computing, NVIDIA is positioned at the center of multiple high-growth technology trends including AI, machine learning, autonomous vehicles, and the metaverse.",
    recommendation: "Perfectly aligns with aggressive technology investing goals due to NVIDIA's unparalleled position in the AI revolution. As the dominant provider of AI training chips, NVIDIA benefits from explosive demand in data centers, cloud computing, and enterprise AI adoption. For growth-focused investors interested in cutting-edge technology, NVIDIA offers exposure to multiple mega-trends: artificial intelligence, autonomous vehicles, gaming, and data center acceleration. The company's competitive moat is strengthened by their CUDA software ecosystem, making it difficult for competitors to displace them. While the stock carries higher volatility typical of aggressive growth plays, the long-term potential in AI infrastructure makes it ideal for investors seeking maximum exposure to transformative technology trends.",
    chartData: [820, 845, 860, 835, 870, 875, 890, 875]
  },
  "AAPL": {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 1.2,
    volume: "52.3M",
    marketCap: "$2.7T",
    peRatio: "28.5",
    description: "Apple Inc. is the world's most valuable technology company, known for its innovative consumer electronics, software, and services. Founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976, Apple has built an unparalleled ecosystem of premium products including the iPhone, Mac computers, iPad tablets, Apple Watch, and AirPods. The company's iOS and macOS operating systems create a seamless user experience across devices, fostering incredible customer loyalty. Apple's Services segment, including the App Store, iCloud, Apple Music, and Apple Pay, generates high-margin recurring revenue. The company is also expanding into new categories like electric vehicles, augmented reality, and healthcare technology. With over 2 billion active devices worldwide and a cash-rich balance sheet, Apple combines the stability of a mature company with the innovation potential of a technology pioneer.",
    recommendation: "Ideal for investors seeking balanced growth with stability, particularly those prioritizing capital preservation alongside steady appreciation. Apple's diverse revenue streams across hardware, software, and services provide resilience against economic downturns, making it perfect for moderate risk tolerance. The company's predictable product upgrade cycles, expanding services ecosystem, and strong brand loyalty deliver consistent cash flows appealing to income-focused investors through dividend growth. For technology enthusiasts who prefer lower volatility, Apple offers exposure to innovation in consumer electronics, autonomous vehicles, and AR/VR without the dramatic swings of pure-play growth stocks. The stock suits long-term wealth building goals with its combination of capital appreciation potential and increasing dividend payments.",
    chartData: [170, 172, 174, 176, 175, 177, 175, 175]
  },
  "MSFT": {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: -0.5,
    volume: "23.7M",
    marketCap: "$2.8T",
    peRatio: "32.1",
    description: "Microsoft Corporation is a global technology giant that has successfully transformed from a traditional software company into a cloud computing and artificial intelligence leader. Founded by Bill Gates and Paul Allen in 1975, Microsoft dominates enterprise software with Windows, Office 365, and development tools. The company's Azure cloud platform is the fastest-growing major cloud service, competing directly with Amazon Web Services. Microsoft's strategic AI integration across all products, including Copilot AI assistants and OpenAI partnership, positions them at the forefront of the AI revolution. Additional revenue streams include Xbox Gaming, LinkedIn professional networking, and enterprise services. With a subscription-based business model providing predictable recurring revenue, strong cash generation, and consistent dividend growth spanning over two decades, Microsoft exemplifies sustainable technology leadership.",
    recommendation: "Perfectly matches balanced investment approaches combining growth potential with income generation through reliable dividends. Microsoft's cloud dominance and AI leadership appeal to technology-focused investors, while their enterprise software moat provides stability for conservative risk profiles. The company's transformation to subscription-based recurring revenue addresses both growth and income investment goals, making it ideal for retirement planning and long-term wealth building. For investors seeking steady dividend growth alongside capital appreciation, Microsoft's 20+ year dividend increase streak demonstrates commitment to shareholder returns. The stock suits moderate risk tolerance with exposure to high-growth cloud computing and AI trends while maintaining the defensive characteristics of enterprise software monopolies.",
    chartData: [375, 380, 382, 378, 376, 379, 381, 378]
  },
  "AMZN": {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 143.67,
    change: 3.4,
    volume: "31.2M",
    marketCap: "$1.5T",
    peRatio: "54.8",
    description: "Amazon.com Inc. is the world's largest e-commerce and cloud computing company, founded by Jeff Bezos in 1994 as an online bookstore. The company has evolved into a global empire spanning online retail, cloud infrastructure, digital advertising, artificial intelligence, and logistics. Amazon Web Services (AWS) is the world's leading cloud platform, generating the majority of Amazon's operating profits while serving millions of businesses globally. The company's e-commerce platform revolutionized retail through innovations like one-click purchasing, Prime membership, and same-day delivery. Amazon's ecosystem includes Alexa voice assistant, Fire devices, Prime Video streaming, Whole Foods grocery stores, and logistics networks. With continuous expansion into new markets like healthcare, pharmacy, and advertising, Amazon demonstrates relentless innovation and customer obsession that has made it an essential part of modern digital infrastructure.",
    recommendation: "Excellent for aggressive growth investors focused on long-term wealth building and comfortable with higher volatility. Amazon's leadership in two massive growth markets - e-commerce and cloud computing - aligns perfectly with technology investment interests and future-focused goals. The company's track record of disrupting traditional industries appeals to investors seeking exposure to transformative business models. AWS provides steady cash flow supporting Amazon's aggressive expansion into new markets, making it suitable for growth-oriented portfolios. For investors prioritizing capital appreciation over dividends and willing to accept cyclical earnings patterns, Amazon offers unmatched exposure to digital transformation trends across retail, cloud computing, and artificial intelligence.",
    chartData: [135, 140, 142, 145, 143, 146, 144, 143]
  },
  "GOOGL": {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: 0.8,
    volume: "18.9M",
    marketCap: "$1.8T",
    peRatio: "25.3",
    description: "Alphabet Inc., Google's parent company, is the world's dominant internet search and digital advertising company, founded by Larry Page and Sergey Brin in 1998. Google Search processes over 8.5 billion queries daily, creating an unassailable moat in information retrieval and targeted advertising. The company's advertising ecosystem, including Google Ads, YouTube, and Google Shopping, captures the majority of global digital ad spending. Beyond advertising, Alphabet operates the Android mobile operating system powering billions of devices, Google Cloud Platform competing in enterprise cloud services, and YouTube as the world's largest video platform. The company invests heavily in artificial intelligence through DeepMind and AI integration across all products, autonomous vehicles via Waymo, and moonshot projects through Other Bets. With massive cash generation from search advertising and expanding presence in cloud computing and AI, Alphabet combines current profitability with future growth potential.",
    recommendation: "Perfect alignment for technology investors seeking sustainable competitive advantages and long-term growth. Alphabet's search monopoly provides consistent cash flows appealing to moderate risk investors, while AI leadership and cloud expansion satisfy aggressive growth objectives. The company's diversified revenue streams across search, YouTube, cloud, and emerging technologies suit balanced investment approaches combining stability with innovation exposure. For investors focused on digital transformation trends, Alphabet offers comprehensive exposure to online advertising, artificial intelligence, and cloud computing megatrends. The stock addresses both growth and value investment styles through dominant market positions, strong cash generation, and reasonable valuation relative to growth prospects.",
    chartData: [138, 140, 141, 143, 142, 144, 143, 142]
  }
};

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addToFinsights, finsights } = useFinsights();
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancedData, setEnhancedData] = useState<{
    description?: string;
    recommendation?: string;
    volume?: string;
    marketCap?: string;
    peRatio?: string;
  }>({});

  // Check if we came from recommendations
  const cameFromRecommendations = location.state?.fromRecommendations;
  // Check if we came from live stocks page
  const cameFromLiveStocks = location.state?.fromLiveStocks;

  // First try to find in mock data, then in NYSE data
  let stock = symbol ? mockStockData[symbol as keyof typeof mockStockData] : null;
  
  // If not found in mock data, search in NYSE stocks
  if (!stock && symbol) {
    const nyseStock = nyseStocks.find(s => s.symbol === symbol);
    if (nyseStock) {
      // Generate a more detailed description based on the company name
      const generateDescription = (name: string, symbol: string) => {
        // Basic industry classification based on common company patterns
        const techKeywords = ['Technology', 'Software', 'Systems', 'Corp', 'Computing', 'Data', 'Digital', 'Cyber', 'Tech'];
        const healthKeywords = ['Pharmaceutical', 'Therapeutics', 'Medical', 'Health', 'Bio', 'Pharma'];
        const finKeywords = ['Bank', 'Financial', 'Capital', 'Investment', 'Credit', 'Insurance'];
        const energyKeywords = ['Energy', 'Oil', 'Gas', 'Power', 'Electric', 'Utility'];
        const retailKeywords = ['Retail', 'Store', 'Market', 'Shopping'];
        
        const isIndustry = (keywords: string[]) => keywords.some(keyword => name.includes(keyword));
        
        if (isIndustry(techKeywords)) {
          return `${name} is a technology company operating in the dynamic tech sector. The company focuses on delivering innovative solutions and services in the rapidly evolving technology landscape. As a publicly traded entity on the NYSE, ${name} participates in the digital transformation trends shaping modern business and consumer markets.`;
        } else if (isIndustry(healthKeywords)) {
          return `${name} operates in the healthcare and life sciences sector, contributing to medical innovation and patient care solutions. The company is positioned within the growing healthcare industry, which benefits from aging demographics and increasing healthcare demand globally. As a NYSE-listed company, ${name} represents investment exposure to healthcare advancement trends.`;
        } else if (isIndustry(finKeywords)) {
          return `${name} is a financial services company providing banking, investment, or insurance solutions to consumers and businesses. Operating in the essential financial sector, the company facilitates economic activity and wealth management. As a publicly traded financial institution, ${name} offers exposure to economic growth and financial market trends.`;
        } else if (isIndustry(energyKeywords)) {
          return `${name} operates in the energy sector, involved in power generation, distribution, or energy-related services. The company participates in the critical energy infrastructure that powers economic activity. As an energy sector stock, ${name} provides exposure to energy market dynamics and the ongoing energy transition.`;
        } else if (isIndustry(retailKeywords)) {
          return `${name} operates in the retail and consumer goods sector, serving consumer demand through various retail channels. The company benefits from consumer spending trends and retail market evolution. As a consumer-focused business, ${name} offers exposure to consumer confidence and spending patterns.`;
        } else {
          return `${name} is an established company listed on the New York Stock Exchange, operating across various business segments to serve its markets. The company has built a presence in its industry through strategic operations and market positioning. As a publicly traded entity, ${name} offers investors exposure to its specific market sector and business fundamentals.`;
        }
      };
      
      const generateRecommendation = (name: string, symbol: string) => {
        return `${name} (${symbol}) appears in our comprehensive NYSE stock database, indicating it meets the listing requirements of America's premier stock exchange. NYSE-listed companies are subject to strict financial reporting and governance standards, providing investors with transparency and regulatory oversight. For specific investment analysis and recommendations tailored to your risk tolerance and investment goals, we recommend consulting with a qualified financial advisor who can evaluate this stock's fundamentals, technical indicators, and alignment with your portfolio objectives. Consider factors such as the company's financial health, industry position, growth prospects, and how it fits within your overall investment strategy.`;
      };

      stock = {
        ...nyseStock,
        marketCap: "N/A",
        peRatio: "N/A", 
        description: generateDescription(nyseStock.name, nyseStock.symbol),
        recommendation: generateRecommendation(nyseStock.name, nyseStock.symbol),
        chartData: [nyseStock.price * 0.95, nyseStock.price * 0.97, nyseStock.price * 0.99, nyseStock.price * 1.01, nyseStock.price * 0.98, nyseStock.price * 1.02, nyseStock.price * 0.99, nyseStock.price]
      };
    }
  }

  // Load enhanced data when component mounts
  useEffect(() => {
    if (stock && symbol) {
      loadEnhancedStockData(symbol);
    }
  }, [symbol, stock]);

  const loadEnhancedStockData = async (stockSymbol: string) => {
    setLoading(true);
    try {
      // Get enhanced description, recommendation, and metrics from OpenAI with timeout
      const timeout = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      );

      const [descriptionRes, recommendationRes, metricsRes] = await Promise.allSettled([
        Promise.race([
          supabase.functions.invoke('stock-data-openai', {
            body: { symbol: stockSymbol, type: 'company-description' }
          }),
          timeout(10000) // 10 second timeout
        ]),
        Promise.race([
          supabase.functions.invoke('stock-data-openai', {
            body: { symbol: stockSymbol, type: 'recommendation' }
          }),
          timeout(10000)
        ]),
        Promise.race([
          supabase.functions.invoke('stock-data-openai', {
            body: { symbol: stockSymbol, type: 'stock-metrics' }
          }),
          timeout(10000)
        ])
      ]);

      const newEnhancedData: any = {};
      
      // Handle description response
      if (descriptionRes.status === 'fulfilled') {
        const result = descriptionRes.value as any;
        if (result?.data?.content) {
          newEnhancedData.description = result.data.content;
        }
      }
      
      // Handle recommendation response
      if (recommendationRes.status === 'fulfilled') {
        const result = recommendationRes.value as any;
        if (result?.data?.content) {
          newEnhancedData.recommendation = result.data.content;
        }
      }
      
      // Handle metrics response
      if (metricsRes.status === 'fulfilled') {
        const result = metricsRes.value as any;
        if (result?.data) {
          newEnhancedData.volume = result.data.volume;
          newEnhancedData.marketCap = result.data.marketCap;
          newEnhancedData.peRatio = result.data.peRatio;
        }
      }
      
      setEnhancedData(newEnhancedData);
    } catch (error) {
      console.error('Error loading enhanced stock data:', error);
      // Set empty enhanced data so loading stops
      setEnhancedData({});
    } finally {
      setLoading(false);
    }
  };

  // Check if stock is already in finsights
  const isAlreadyInFinsights = stock ? finsights.some(s => s.symbol === stock.symbol) : false;

  const handleAddToFinsights = () => {
    if (!stock) return;
    
    if (isAlreadyInFinsights) {
      toast({
        title: "Already in Finsights",
        description: `${stock.symbol} is already in your finsights`
      });
      return;
    }
    
    addToFinsights({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      reason: stock.recommendation
    });
    
    setIsAdded(true);
    toast({
      title: "Added to Finsights",
      description: `${stock.symbol} has been added to your finsights`
    });
  };

  if (!stock) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4">
        <div className="pt-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Stock not found</p>
          </div>
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...stock.chartData);
  const minPrice = Math.min(...stock.chartData);

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            if (cameFromRecommendations) {
              navigate('/recommend', { state: { showRecommendations: true } });
            } else {
              navigate(-1);
            }
          }} 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {cameFromRecommendations ? 'Back to Recommendations' : 'Back'}
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{stock.symbol}</h1>
            <p className="text-muted-foreground">{stock.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
            <div className={`text-sm flex items-center gap-1 ${
              stock.change >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Stock Chart */}
      <Card className="p-4 mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
        <h3 className="font-semibold mb-4">Price Chart (7 Days)</h3>
        <div className="h-32 flex items-end justify-between gap-1">
          {stock.chartData.map((price, index) => {
            const height = ((price - minPrice) / (maxPrice - minPrice)) * 100;
            return (
              <div
                key={index}
                className="bg-primary/70 rounded-t flex-1 transition-all hover:bg-primary"
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            );
          })}
        </div>
      </Card>

      {/* Stock Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
          <div className="text-sm text-muted-foreground">Volume</div>
          <div className="font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              enhancedData.volume || stock.volume
            )}
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
          <div className="text-sm text-muted-foreground">Market Cap</div>
          <div className="font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              enhancedData.marketCap || stock.marketCap
            )}
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
          <div className="text-sm text-muted-foreground">P/E Ratio</div>
          <div className="font-bold">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              enhancedData.peRatio || stock.peRatio
            )}
          </div>
        </Card>
      </div>

      {/* Company Description */}
      <Card className="p-4 mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
        <h3 className="font-semibold mb-3">About {stock.name}</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading enhanced company information...
          </div>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {enhancedData.description || stock.description}
          </p>
        )}
      </Card>

      {/* Why Recommended - Only show if came from recommendations */}
      {cameFromRecommendations && (
        <Card className="p-4 mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Why This Stock Was Recommended
          </h3>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading enhanced recommendation...
            </div>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {(enhancedData.recommendation || location.state?.recommendationReason || stock.recommendation).split('\n\nDisclaimer:')[0]}
            </p>
          )}
        </Card>
      )}

      {/* Disclaimer - show once above button */}
      <div className="text-xs text-muted-foreground text-center p-4 bg-accent/10 rounded-lg mb-6">
        <strong>Disclaimer:</strong> We are not qualified financial advisors. Please consult with a qualified financial advisor before making any investment decisions.
      </div>

      {/* Add to Finsights Button */}
      <Button 
        onClick={handleAddToFinsights}
        disabled={isAdded || isAlreadyInFinsights}
        className="w-full"
      >
        {isAdded || isAlreadyInFinsights ? "Added to Finsights" : "Add to My Finsights"}
      </Button>
    </div>
  );
};

export default StockDetail;
