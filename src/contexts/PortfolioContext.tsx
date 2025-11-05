import React, { createContext, useContext, useState, useEffect } from 'react';
import { polygonService } from '@/services/polygonService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface PortfolioStock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  change: number;
}

interface PortfolioContextType {
  portfolio: PortfolioStock[];
  addStock: (stock: PortfolioStock) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, shares: number) => void;
  getTotalValue: () => number;
  getTotalChange: () => number;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load portfolio from Supabase when user changes
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user) {
        setPortfolio([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Use database values as fallback, then try to fetch fresh prices
        const portfolioWithPrices = await Promise.all(
          (data || []).map(async (item) => {
            // Use database values as initial/fallback
            const dbPrice = Number(item.current_price) || 0;
            const dbChange = Number(item.change) || 0;
            
            try {
              const quote = await polygonService.getStockQuote(item.symbol);
              const newPrice = quote.price || dbPrice;
              const newChange = quote.change || dbChange;
              
              // Update database with fresh values if we got them
              if (quote.price && quote.price !== dbPrice) {
                await supabase
                  .from('portfolio')
                  .update({ 
                    current_price: newPrice,
                    change: newChange 
                  })
                  .eq('id', item.id)
                  .eq('user_id', user.id);
              }
              
              return {
                id: item.id,
                symbol: item.symbol,
                name: item.name,
                shares: Number(item.shares),
                currentPrice: newPrice,
                change: newChange,
              };
            } catch {
              // On API failure, use database values
              return {
                id: item.id,
                symbol: item.symbol,
                name: item.name,
                shares: Number(item.shares),
                currentPrice: dbPrice,
                change: dbChange,
              };
            }
          })
        );

        setPortfolio(portfolioWithPrices);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const symbols = Array.from(new Set(portfolio.map((p) => p.symbol)));
        const quotes = await Promise.all(
          symbols.map(async (sym) => {
            try {
              const q = await polygonService.getStockQuote(sym);
              return { sym, q };
            } catch {
              return { sym, q: null };
            }
          })
        );
        if (!isMounted) return;
        
        setPortfolio((prev) => prev.map((s) => {
          const found = quotes.find((x) => x.sym === s.symbol)?.q;
          if (found && typeof found.price === 'number' && !Number.isNaN(found.price)) {
            // Update database with fresh values
            supabase
              .from('portfolio')
              .update({ 
                current_price: found.price,
                change: found.change 
              })
              .eq('id', s.id)
              .eq('user_id', user?.id || '');
            
            return { ...s, currentPrice: found.price, change: found.change };
          }
          return s;
        }));
      } catch (e) {
        console.warn('Polygon refresh failed for portfolio');
      }
    };

    refresh();
    const id = setInterval(refresh, 60000);
    return () => { isMounted = false; clearInterval(id); };
  }, [portfolio.map(p => p.symbol).join('|')]);

  const addStock = async (stock: PortfolioStock) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolio')
        .insert({
          user_id: user.id,
          symbol: stock.symbol,
          name: stock.name,
          shares: stock.shares,
          current_price: stock.currentPrice,
          change: stock.change,
        })
        .select()
        .single();

      if (error) throw error;

      setPortfolio(prev => [{
        ...stock,
        id: data.id,
      }, ...prev]);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const removeStock = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPortfolio(prev => prev.filter(stock => stock.id !== id));
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const updateStock = async (id: string, shares: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolio')
        .update({ shares })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPortfolio(prev => prev.map(stock => 
        stock.id === id ? { ...stock, shares } : stock
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const getTotalValue = () => {
    return portfolio.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
  };

  const getTotalChange = () => {
    return portfolio.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice * stock.change / 100), 0);
  };

  return (
    <PortfolioContext.Provider value={{ 
      portfolio, 
      addStock, 
      removeStock, 
      updateStock, 
      getTotalValue, 
      getTotalChange 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};