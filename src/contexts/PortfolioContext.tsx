import React, { createContext, useContext, useState, useEffect } from 'react';
import { polygonService } from '@/services/polygonService';

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
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([
    { id: "1", symbol: "AAPL", name: "Apple Inc.", shares: 10, currentPrice: 175.43, change: 2.1 },
    { id: "2", symbol: "MSFT", name: "Microsoft", shares: 5, currentPrice: 378.85, change: -1.2 },
    { id: "3", symbol: "GOOGL", name: "Alphabet", shares: 3, currentPrice: 142.56, change: 0.8 },
    { id: "4", symbol: "TSLA", name: "Tesla", shares: 2, currentPrice: 251.23, change: 4.3 },
  ]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const symbols = Array.from(new Set(portfolio.map((p) => p.symbol)));
        const quotes = await Promise.all(symbols.map(async (sym) => ({ sym, q: await polygonService.getStockQuote(sym) })));
        if (!isMounted) return;
        setPortfolio((prev) => prev.map((s) => {
          const found = quotes.find((x) => x.sym === s.symbol)?.q;
          if (found && typeof found.price === 'number' && !Number.isNaN(found.price)) {
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

  const addStock = (stock: PortfolioStock) => {
    setPortfolio(prev => [stock, ...prev]); // Add to the beginning (top)
  };

  const removeStock = (id: string) => {
    setPortfolio(prev => prev.filter(stock => stock.id !== id));
  };
  const updateStock = (id: string, shares: number) => {
    setPortfolio(prev => prev.map(stock => 
      stock.id === id ? { ...stock, shares } : stock
    ));
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