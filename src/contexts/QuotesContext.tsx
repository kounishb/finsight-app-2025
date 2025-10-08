import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import polygonService, { PolygonStock } from '@/services/polygonService';

interface QuotesContextType {
  getQuote: (symbol: string) => PolygonStock | undefined;
  preload: (symbols: string[]) => Promise<void>;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [cache, setCache] = useState<Record<string, PolygonStock>>({});
  const symbolsRef = useRef<Set<string>>(new Set());

  const getQuote = (symbol: string) => cache[symbol];

  const preload = async (symbols: string[]) => {
    const unique = symbols.map(s => s.toUpperCase()).filter(Boolean);
    unique.forEach(s => symbolsRef.current.add(s));
    if (unique.length === 0) return;
    const results = await Promise.all(unique.map(async (sym) => ({ sym, q: await polygonService.getStockQuote(sym) })));
    const next: Record<string, PolygonStock> = {};
    results.forEach(({ sym, q }) => { if (q) next[sym] = q; });
    if (Object.keys(next).length > 0) setCache(prev => ({ ...prev, ...next }));
  };

  useEffect(() => {
    let isMounted = true;
    const refresh = async () => {
      const symbols = Array.from(symbolsRef.current);
      if (symbols.length === 0) return;
      const results = await Promise.all(symbols.map(async (sym) => ({ sym, q: await polygonService.getStockQuote(sym) })));
      if (!isMounted) return;
      const next: Record<string, PolygonStock> = {};
      results.forEach(({ sym, q }) => { if (q) next[sym] = q; });
      if (Object.keys(next).length > 0) setCache(prev => ({ ...prev, ...next }));
    };

    // Initial refresh shortly after mount to avoid blocking FCP
    const t0 = setTimeout(refresh, 200);
    const id = setInterval(refresh, 60000);
    return () => { isMounted = false; clearTimeout(t0); clearInterval(id); };
  }, []);

  const value = useMemo(() => ({ getQuote, preload }), [cache]);

  return (
    <QuotesContext.Provider value={value}>
      {children}
    </QuotesContext.Provider>
  );
};

export const useQuotes = () => {
  const ctx = useContext(QuotesContext);
  if (!ctx) throw new Error('useQuotes must be used within a QuotesProvider');
  return ctx;
};


