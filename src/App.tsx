import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import { AuthProvider } from "./lib/auth";
import PageLayout from "./components/PageLayout";
import Jop from "./pages/Jop";
import TermsOfUse from "./pages/TermsOfUse";
import { HelmetProvider } from "react-helmet-async";

// Ленивая загрузка остальных страниц
const Catalog = lazy(() => import("./pages/Catalog"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Promotions = lazy(() => import("./pages/Promotions"));
const PromotionDetail = lazy(() => import("./pages/PromotionDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageLayout>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/jop" element={<Jop />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/promotions/:id" element={<PromotionDetail />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/agreement" element={<TermsOfUse />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;