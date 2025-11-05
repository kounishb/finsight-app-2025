import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [finsights, setFinsights] = useState<Stock[]>([]);

  // Load finsights from Supabase when user changes
  useEffect(() => {
    const loadFinsights = async () => {
      if (!user) {
        setFinsights([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('finsights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setFinsights((data || []).map(item => ({
          symbol: item.symbol,
          name: item.name,
          price: Number(item.price),
          change: Number(item.change),
          reason: item.reason,
        })));
      } catch (error) {
        console.error('Error loading finsights:', error);
      }
    };

    loadFinsights();
  }, [user]);

  const addToFinsights = async (stock: Stock) => {
    if (!user) return;

    // Check if stock already exists
    if (finsights.some(s => s.symbol === stock.symbol)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('finsights')
        .insert({
          user_id: user.id,
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          reason: stock.reason,
        });

      if (error) throw error;

      setFinsights(prev => [stock, ...prev]);
    } catch (error) {
      console.error('Error adding to finsights:', error);
    }
  };

  const removeFromFinsights = async (symbol: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('finsights')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (error) throw error;

      setFinsights(prev => prev.filter(s => s.symbol !== symbol));
    } catch (error) {
      console.error('Error removing from finsights:', error);
    }
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
