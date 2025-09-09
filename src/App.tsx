
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PortfolioProvider>
          <FinsightsProvider>
            <BrowserRouter>
          <div className="min-h-screen bg-background">
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNavigation />
          </div>
            </BrowserRouter>
          </FinsightsProvider>
        </PortfolioProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
