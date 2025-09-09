
import React, { createContext, useContext, useState } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  reason?: string;
}

interface FinsightsContextType {
  finsights: Stock[];
  addToFinsights: (stock: Stock) => void;
  removeFromFinsights: (symbol: string) => void;
}

const FinsightsContext = createContext<FinsightsContextType | undefined>(undefined);

export const FinsightsProvider = ({ children }: { children: React.ReactNode }) => {
  const [finsights, setFinsights] = useState<Stock[]>([]);

  const addToFinsights = (stock: Stock) => {
    setFinsights(prev => {
      // Check if stock already exists
      if (prev.some(s => s.symbol === stock.symbol)) {
        return prev;
      }
      // Add new stock to the beginning (top) of the list
      return [stock, ...prev];
    });
  };

  const removeFromFinsights = (symbol: string) => {
    setFinsights(prev => prev.filter(s => s.symbol !== symbol));
  };

  return (
    <FinsightsContext.Provider value={{ finsights, addToFinsights, removeFromFinsights }}>
      {children}
    </FinsightsContext.Provider>
  );
};

export const useFinsights = () => {
  const context = useContext(FinsightsContext);
  if (!context) {
    throw new Error('useFinsights must be used within a FinsightsProvider');
  }
  return context;
};
