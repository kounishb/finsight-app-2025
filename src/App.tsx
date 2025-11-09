
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { FinsightsProvider } from "@/contexts/FinsightsContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Recommend from "./pages/Recommend";
import Portfolio from "./pages/Portfolio";
import LiveStocks from "./pages/LiveStocks";
import Explore from "./pages/Explore";
import Articles from "./pages/Articles";
import Videos from "./pages/Videos";
import StockDetail from "./pages/StockDetail";
import SignIn from "./pages/SignIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouterWithLoader = () => {
  const location = useLocation();
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    const handleReady = (e: any) => {
      if (e?.detail?.path === location.pathname) {
        setNavLoading(false);
      }
    };
    const handleNavigating = (e: any) => {
      if (e?.detail?.path === '/stocks') {
        setNavLoading(true);
      }
    };
    window.addEventListener('routeReady', handleReady as any);
    window.addEventListener('routeNavigating', handleNavigating as any);

    // If navigating to Live Stocks, show loader until the page signals ready
    if (location.pathname === '/stocks') {
      setNavLoading(true);
      // Safety timeout to avoid indefinite loader
      timeoutId = window.setTimeout(() => setNavLoading(false), 15000);
    } else {
      setNavLoading(false);
    }

    return () => {
      window.removeEventListener('routeReady', handleReady as any);
      window.removeEventListener('routeNavigating', handleNavigating as any);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {navLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-8 w-8 inline-block rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Loading Live Stocks…</span>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/stocks" element={<LiveStocks />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PortfolioProvider>
          <FinsightsProvider>
            <BrowserRouter>
              <RouterWithLoader />
            </BrowserRouter>
          </FinsightsProvider>
        </PortfolioProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
