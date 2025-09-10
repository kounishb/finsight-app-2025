
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Search, BarChart3, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { nyseStocks } from "@/data/nyseStocks";
import { AlphaVantageService, AlphaVantageStock } from "@/services/alphaVantageService";

const marketIndices = [
  { name: "S&P 500", value: "4,567.89", change: 0.7 },
  { name: "Dow Jones", value: "35,432.10", change: -0.3 },
  { name: "Nasdaq", value: "14,123.45", change: 1.2 }
];

const LiveStocks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all">("all");
  const [sortBy, setSortBy] = useState<"alphabetical" | "price-high" | "price-low" | "increase-high" | "decrease-high">("alphabetical");
  const [allStocks, setAllStocks] = useState<AlphaVantageStock[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllStocks();
  }, []);

  const loadAllStocks = async () => {
    setLoading(true);
    try {
      const [nyseData, nasdaqData] = await Promise.all([
        AlphaVantageService.getAllNYSEStocks(),
        AlphaVantageService.getAllNASDAQStocks()
      ]);
      
      // Combine and deduplicate stocks
      const combined = [...nyseData, ...nasdaqData];
      const uniqueStocks = combined.filter((stock, index, self) => 
        index === self.findIndex(s => s.symbol === stock.symbol)
      );
      
      setAllStocks(uniqueStocks);
    } catch (error) {
      console.error('Error loading stocks:', error);
      // Fallback to static data
      setAllStocks(nyseStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.change,
        volume: stock.volume
      })));
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = allStocks.filter(stock => {
    if (!searchTerm.trim()) {
      return true;
    }
    
    // Has search term, check for exact matches first
    const searchLower = searchTerm.toLowerCase().trim();
    const symbolMatch = stock.symbol.toLowerCase() === searchLower;
    const nameMatch = stock.name.toLowerCase() === searchLower;
    
    // If exact match found, return it
    if (symbolMatch || nameMatch) {
      return true;
    }
    
    // Check for partial matches
    const symbolIncludes = stock.symbol.toLowerCase().includes(searchLower);
    const nameIncludes = stock.name.toLowerCase().includes(searchLower);
    
    if (symbolIncludes || nameIncludes) {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "increase-high":
        return b.change - a.change;
      case "decrease-high":
        return a.change - b.change;
      case "alphabetical":
      default:
        return a.symbol.localeCompare(b.symbol);
    }
  });

  // If search term exists but no results found, show appropriate message
  const hasSearchTerm = searchTerm.trim().length > 0;
  const noResults = hasSearchTerm && filteredStocks.length === 0;

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Live Stocks
        </h1>
        <p className="text-muted-foreground mt-1">Real-time market data</p>
      </div>

      {/* Market Indices */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Market Overview</h2>
        <div className="grid grid-cols-3 gap-3">
          {marketIndices.map((index) => (
            <Card key={index.name} className="p-3 bg-gradient-to-br from-card to-card/80 border-border/50">
              <div className="text-xs text-muted-foreground mb-1">{index.name}</div>
              <div className="font-bold text-sm">{index.value}</div>
              <div className={`text-xs flex items-center gap-1 ${
                index.change >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {index.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {index.change >= 0 ? '+' : ''}{index.change}%
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="price-high">Highest Price</SelectItem>
              <SelectItem value="price-low">Lowest Price</SelectItem>
              <SelectItem value="increase-high">Highest Increase</SelectItem>
              <SelectItem value="decrease-high">Highest Decrease</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading latest stock data...</span>
          </div>
        ) : filteredStocks.map((stock, index) => (
          <Card 
            key={`${stock.symbol}-${index}`} 
            className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 hover:bg-accent/20 transition-colors cursor-pointer"
            onClick={() => navigate(`/stock/${stock.symbol}`, { state: { fromLiveStocks: true } })}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{stock.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[150px]">{stock.name}</div>
                    <div className="text-xs text-muted-foreground">Close: ${(stock as any).close?.toFixed(2) || stock.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">${stock.price.toFixed(2)}</div>
                <div className={`text-sm flex items-center gap-1 justify-end ${
                  stock.change >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
                
              </div>
            </div>
          </Card>
        ))}
      </div>

        {!loading && noResults && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No stocks found for "{searchTerm}". The stock may not exist in our database.
            </p>
          </div>
        )}
      
      {!loading && !hasSearchTerm && filteredStocks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stocks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default LiveStocks;
