import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { nyseStocks } from "@/data/nyseStocks";
import { polygonService } from "@/services/polygonService";

const Portfolio = () => {
  const { toast } = useToast();
  const { portfolio, addStock, removeStock, updateStock, getTotalValue, getTotalChange } = usePortfolio();
  
  const [newStock, setNewStock] = useState({
    symbol: "",
    shares: ""
  });

  const [deleteStock, setDeleteStock] = useState<{ id: string; shares: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [liveQuotes, setLiveQuotes] = useState<Record<string, { price: number; change: number }>>({});

  const totalValue = getTotalValue();
  const totalChange = getTotalChange();

  // Hydrate from cached market data immediately, then refresh in background
  useEffect(() => {
    // 1) Cache-first paint
    const cached = (polygonService as any).getCachedStocks?.(15 * 60 * 1000);
    if (cached && Array.isArray(cached)) {
      const map: Record<string, { price: number; change: number }> = {};
      for (const s of cached) {
        map[s.symbol] = { price: s.price, change: s.change };
      }
      // only keep relevant symbols to reduce memory
      const filtered: Record<string, { price: number; change: number }> = {};
      for (const p of portfolio) {
        if (map[p.symbol]) filtered[p.symbol] = map[p.symbol];
      }
      if (Object.keys(filtered).length > 0) setLiveQuotes(filtered);
    }

    // 2) Network refresh
    const refresh = async () => {
      try {
        const stocks = await polygonService.getAllStocks();
        const map: Record<string, { price: number; change: number }> = {};
        for (const s of stocks) {
          map[s.symbol] = { price: s.price, change: s.change };
        }
        const updated: Record<string, { price: number; change: number }> = {};
        const missing: string[] = [];
        for (const p of portfolio) {
          if (map[p.symbol]) updated[p.symbol] = map[p.symbol];
          else missing.push(p.symbol);
        }
        if (missing.length) {
          // fetch quotes for missing symbols
          for (const sym of missing) {
            try {
              const q = await polygonService.getStockQuote(sym);
              if (q) updated[sym] = { price: q.price, change: q.change };
            } catch {}
          }
        }
        if (Object.keys(updated).length > 0) setLiveQuotes(prev => ({ ...prev, ...updated }));
      } catch (e) {
        // ignore network errors; UI keeps cached or stored values
      }
    };

    refresh();

    // 3) Realtime price updates (every 30s)
    const interval = setInterval(async () => {
      try {
        const symbols = portfolio.map(p => p.symbol);
        if (symbols.length === 0) return;
        const updates: Record<string, { price: number; change: number | undefined }> = {};
        await Promise.all(symbols.map(async (sym) => {
          try {
            const rt = await polygonService.getRealtimeQuote(sym);
            if (rt && typeof rt.price === 'number') {
              // keep existing change if we have one
              const existing = liveQuotes[sym];
              const change = existing?.change ?? undefined;
              updates[sym] = { price: rt.price, change } as any;
            }
          } catch {}
        }));
        if (Object.keys(updates).length > 0) {
          setLiveQuotes(prev => {
            const merged: Record<string, { price: number; change: number }> = { ...prev } as any;
            for (const k of Object.keys(updates)) {
              const u = updates[k];
              merged[k] = { price: u.price, change: (u.change ?? merged[k]?.change ?? 0) as number };
            }
            return merged;
          });
        }
      } catch {}
    }, 30000);

    return () => clearInterval(interval);
    // We intentionally run once on mount; portfolio edits will trigger separate flows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter stocks for autocomplete suggestions - prioritize stocks starting with typed letters
  const stockSuggestions = useMemo(() => {
    if (!newStock.symbol) return [];
    const searchTerm = newStock.symbol.toLowerCase();
    
    // First get stocks that start with the search term
    const startsWithMatches = nyseStocks.filter(stock => 
      stock.symbol.toLowerCase().startsWith(searchTerm) ||
      stock.name.toLowerCase().startsWith(searchTerm)
    );
    
    // Then get stocks that contain the search term but don't start with it
    const containsMatches = nyseStocks.filter(stock => 
      !stock.symbol.toLowerCase().startsWith(searchTerm) &&
      !stock.name.toLowerCase().startsWith(searchTerm) &&
      (stock.symbol.toLowerCase().includes(searchTerm) ||
       stock.name.toLowerCase().includes(searchTerm))
    );
    
    // Combine them with priority to "starts with" matches
    const allMatches = [...startsWithMatches, ...containsMatches];
    return allMatches.slice(0, 5);
  }, [newStock.symbol]);

  const handleAddStock = async () => {
    if (!newStock.symbol || !newStock.shares) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const upper = newStock.symbol.toUpperCase();
    const stockInfo = nyseStocks.find(stock => stock.symbol.toUpperCase() === upper);

    if (!stockInfo) {
      // Allow adding if Polygon recognizes it even if not in nyseStocks list
      // We'll still try Polygon below; if that also fails, show error
    }

    let price = stockInfo?.price ?? 0;
    let change = stockInfo?.change ?? 0;
    let name = stockInfo?.name ?? upper;

    // Prefer realtime price first, then fallback daily quote
    try {
      const rt = await polygonService.getRealtimeQuote(upper);
      if (rt && typeof rt.price === 'number') {
        price = rt.price;
      }
    } catch {}

    try {
      // Use daily to get percentage change context if available
      const quote = await polygonService.getStockQuote(upper);
      if (quote) {
        if (!price) price = quote.price;
        change = quote.change;
      }
    } catch (e) {}

    if (!price || Number.isNaN(price)) {
      toast({
        title: "Error",
        description: "Stock not found or quote unavailable. Please enter a valid ticker symbol.",
        variant: "destructive"
      });
      return;
    }

    const stock = {
      id: Date.now().toString(),
      symbol: upper,
      name,
      shares: parseInt(newStock.shares),
      currentPrice: price,
      change
    };

    addStock(stock);
    setNewStock({ symbol: "", shares: "" });
    setIsOpen(false);
    setShowSuggestions(false);
    
    toast({
      title: "Success",
      description: `Added ${stock.symbol} to your portfolio`
    });
  };

  const handleSuggestionClick = (suggestion: any) => {
    setNewStock({ ...newStock, symbol: suggestion.symbol });
    setShowSuggestions(false);
  };

  const handleRemoveStock = (id: string) => {
    const stock = portfolio.find(s => s.id === id);
    if (!stock) return;

    if (stock.shares > 1) {
      setDeleteStock({ id, shares: stock.shares });
    } else {
      removeStock(id);
      toast({
        title: "Removed",
        description: `${stock.symbol} removed from portfolio`
      });
    }
  };

  const handleConfirmDelete = (sharesToDelete: number) => {
    if (!deleteStock) return;
    
    const stock = portfolio.find(s => s.id === deleteStock.id);
    if (!stock) return;

    if (sharesToDelete >= stock.shares) {
      removeStock(deleteStock.id);
      toast({
        title: "Removed",
        description: `${stock.symbol} removed from portfolio`
      });
    } else {
      updateStock(deleteStock.id, stock.shares - sharesToDelete);
      toast({
        title: "Updated",
        description: `Removed ${sharesToDelete} shares of ${stock.symbol}`
      });
    }
    setDeleteStock(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Portfolio
        </h1>
        <p className="text-muted-foreground mt-1">Manage your stock holdings</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
          <div className="text-sm text-muted-foreground">Today's Change</div>
          <div className={`text-2xl font-bold ${totalChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Add Stock Button */}
      <div className="mb-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="symbol">Stock Ticker Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., AAPL, MSFT, GOOGL"
                  value={newStock.symbol}
                  onChange={(e) => {
                    setNewStock({ ...newStock, symbol: e.target.value });
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(newStock.symbol.length > 0)}
                />
                {showSuggestions && stockSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {stockSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.symbol}
                        className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="font-medium">{suggestion.symbol}</div>
                        <div className="text-sm text-muted-foreground">{suggestion.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="shares">Number of Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="e.g., 10"
                  value={newStock.shares}
                  onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
                />
              </div>
              <Button onClick={handleAddStock} className="w-full">
                Add to Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Holdings */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold">Your Holdings</h2>
        </div>
        <ScrollArea className="h-96">
          <div className="space-y-3 p-4">
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Add stocks to your portfolio to track your investments!</p>
              </div>
            ) : (
              portfolio.map((stock) => (
              <div 
                key={stock.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                  <div className="text-xs text-muted-foreground">{stock.shares} shares</div>
                </div>
                
                <div className="text-center mr-4">
                  {(() => {
                    const q = liveQuotes[stock.symbol];
                    const price = q?.price ?? stock.currentPrice;
                    const change = q?.change ?? stock.change;
                    return (
                      <>
                        <div className="font-semibold">${price.toFixed(2)}</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          change >= 0 ? 'text-success' : 'text-danger'
                        }`}>
                          {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="text-right mr-4">
                  {(() => {
                    const q = liveQuotes[stock.symbol];
                    const price = q?.price ?? stock.currentPrice;
                    return (
                      <>
                        <div className="font-semibold">
                          ${(stock.shares * price).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Value</div>
                      </>
                    );
                  })()}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStock(stock.id)}
                  className="text-danger hover:text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteStock && (
        <Dialog open={!!deleteStock} onOpenChange={() => setDeleteStock(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Shares</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>How many shares would you like to remove? (You have {deleteStock.shares} shares)</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sharesToDelete">Number of shares to remove</Label>
                  <Input
                    id="sharesToDelete"
                    type="number"
                    min="1"
                    max={deleteStock.shares}
                    placeholder="Enter number of shares"
                    ref={(input) => {
                      if (input) {
                        input.addEventListener('input', (e) => {
                          const target = e.target as HTMLInputElement;
                          const value = parseInt(target.value);
                          if (value > 0 && value <= deleteStock.shares) {
                            target.style.borderColor = 'hsl(var(--primary))';
                          }
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById('sharesToDelete') as HTMLInputElement;
                      const value = parseInt(input.value);
                      if (value > 0 && value <= deleteStock.shares) {
                        handleConfirmDelete(value);
                      }
                    }}
                    className="flex-1"
                  >
                    Remove Shares
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleConfirmDelete(deleteStock.shares)}
                    className="flex-1"
                  >
                    Remove All ({deleteStock.shares})
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Portfolio;
