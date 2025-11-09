
import { FinancialCard } from "@/components/FinancialCard";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Lightbulb, Menu, X } from "lucide-react";
import { useFinsights } from "@/contexts/FinsightsContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { polygonService } from "@/services/polygonService";

const Home = () => {
  const navigate = useNavigate();
  const { finsights, removeFromFinsights } = useFinsights();
  const { portfolio, getTotalValue, getTotalChange } = usePortfolio();
  const [liveQuotes, setLiveQuotes] = useState<Record<string, { price: number; change: number }>>({});
  
  const totalPortfolioValue = getTotalValue();
  const totalDailyChange = getTotalChange();

  // Hydrate from cache and refresh with realtime updates, similar to Portfolio
  useEffect(() => {
    // Cache-first
    const cached = (polygonService as any).getCachedStocks?.(15 * 60 * 1000);
    if (cached && Array.isArray(cached)) {
      const map: Record<string, { price: number; change: number }> = {};
      for (const s of cached) {
        map[s.symbol] = { price: s.price, change: s.change };
      }
      const filtered: Record<string, { price: number; change: number }> = {};
      for (const p of portfolio) {
        if (map[p.symbol]) filtered[p.symbol] = map[p.symbol];
      }
      if (Object.keys(filtered).length > 0) setLiveQuotes(filtered);
    }

    // Network refresh for daily context and missing symbols
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
          for (const sym of missing) {
            try {
              const q = await polygonService.getStockQuote(sym);
              if (q) updated[sym] = { price: q.price, change: q.change };
            } catch {}
          }
        }
        if (Object.keys(updated).length > 0) setLiveQuotes(prev => ({ ...prev, ...updated }));
      } catch {}
    };
    refresh();

    // Realtime updates every 30s
    const interval = setInterval(async () => {
      try {
        const symbols = portfolio.map(p => p.symbol);
        if (symbols.length === 0) return;
        const updates: Record<string, { price: number; change: number | undefined }> = {};
        await Promise.all(symbols.map(async (sym) => {
          try {
            const rt = await polygonService.getRealtimeQuote(sym);
            if (rt && typeof rt.price === 'number') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      {/* Header */}
      <div className="pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Finsight
          </h1>
          <p className="text-muted-foreground mt-1">Your financial companion</p>
        </div>
        <Sidebar>
          <Button variant="ghost" size="sm">
            <Menu className="h-6 w-6" />
          </Button>
        </Sidebar>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <FinancialCard
          title="Net Worth"
          value={`$${totalPortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          change={{
            value: `$${Math.abs(totalDailyChange).toFixed(2)}`,
            isPositive: totalDailyChange >= 0
          }}
        />
        <FinancialCard
          title="Daily Change"
          value={totalPortfolioValue === 0 ? '+0%' : `${totalDailyChange >= 0 ? '+' : ''}${((totalDailyChange / totalPortfolioValue) * 100).toFixed(2)}%`}
        />
      </div>

      {/* Your Portfolio */}
      <Card className="mb-6 bg-gradient-to-br from-card to-card/80 border-border/50">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Your Portfolio
          </h2>
        </div>
        <ScrollArea className="h-64">
          <div className="space-y-3 p-4">
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Add stocks to your portfolio to track your investments!</p>
                <Button onClick={() => navigate('/portfolio')} variant="default" size="sm">
                  Add to Portfolio
                </Button>
              </div>
            ) : (
              portfolio.map((stock) => (
              <div key={stock.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                  <div className="text-xs text-muted-foreground">{stock.shares} shares</div>
                </div>
                <div className="text-right">
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
                          {change >= 0 ? '+' : ''}{Number(change).toFixed(2)}%
                        </div>
                      </>
                  );
                })()}
                </div>
              </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Your Finsights */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Your Finsights
          </h2>
        </div>
        <ScrollArea className="h-48">
          <div className="space-y-3 p-4">
            {finsights.length === 0 ? (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Complete the recommendation quiz to get your personalized finsights!</p>
                <Button onClick={() => navigate('/recommend')} variant="default" size="sm">
                  Take Recommendation Quiz
                </Button>
              </div>
            ) : (
              finsights.map((stock, index) => (
                <div key={index} className="p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground mb-1">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-semibold">${stock.price.toFixed(2)}</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          stock.change >= 0 ? 'text-success' : 'text-danger'
                        }`}>
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromFinsights(stock.symbol)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Home;
