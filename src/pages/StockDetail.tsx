
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinsights } from "@/contexts/FinsightsContext";
// Dynamic data services
import { AlphaVantageService } from "@/services/alphaVantageService";
import polygonService from "@/services/polygonService";
import { supabase } from "@/integrations/supabase/client";
import { polygonService } from "@/services/polygonService";

// Remove static mock data: all data will be fetched dynamically

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
    if (!symbol) return;
    loadStockAndEnhancedData(symbol);
  }, [symbol]);

  const loadStockAndEnhancedData = async (stockSymbol: string) => {
    setLoading(true);
    try {
      // Fetch quote/ohlc and enhanced info with timeout safeguards
      const timeout = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      );

      const [quoteRes, polygonRes, descriptionRes, recommendationRes, metricsRes] = await Promise.allSettled([
        Promise.race([
          AlphaVantageService.getStockQuote(stockSymbol),
          timeout(10000)
        ]),
        Promise.race([
          polygonService.getStockQuote(stockSymbol),
          timeout(10000)
        ]),
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
      let newStock: any = null;

      // Handle quote response (price/change/name)
      if (quoteRes.status === 'fulfilled' && quoteRes.value) {
        const q: any = quoteRes.value;
        newStock = {
          symbol: q.symbol || stockSymbol.toUpperCase(),
          name: q.name || stockSymbol.toUpperCase(),
          price: typeof q.price === 'number' ? q.price : (q.close ?? 0),
          change: typeof q.change === 'number' ? q.change : 0,
        };
      }

      // Handle polygon OHLC to construct a simple mini-series
      if (polygonRes.status === 'fulfilled' && polygonRes.value) {
        const p: any = polygonRes.value;
        const open = p.open ?? p.o ?? 0;
        const high = p.high ?? p.h ?? open;
        const low = p.low ?? p.l ?? open;
        const close = p.close ?? p.c ?? open;
        const chartData = [open, (open + high) / 2, high, (high + close) / 2, close];
        if (!newStock) {
          newStock = {
            symbol: stockSymbol.toUpperCase(),
            name: stockSymbol.toUpperCase(),
            price: close,
            change: ((close - open) / (open || 1)) * 100,
          };
        }
        newStock.chartData = chartData;
      }

      // Ensure chartData exists even if polygon failed
      if (newStock && !newStock.chartData) {
        const base = newStock.price || 0;
        newStock.chartData = [base * 0.98, base * 0.99, base, base * 1.005, base * 1.01];
      }
      
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
      
      // Attach recommendation to stock used by Add to Finsights
      if (newStock) {
        newStock.recommendation = newEnhancedData.recommendation;
        setStock(newStock);
      } else {
        setStock(null);
      }

      setEnhancedData(newEnhancedData);
    } catch (error) {
      console.error('Error loading enhanced stock data:', error);
      // Set empty enhanced data so loading stops
      setEnhancedData({});
      setStock(null);
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
      reason: enhancedData.recommendation || stock.recommendation
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
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading stock data...
              </div>
            ) : (
              <p className="text-muted-foreground">Stock not found</p>
            )}
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
            {enhancedData.description || 'No description available.'}
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
