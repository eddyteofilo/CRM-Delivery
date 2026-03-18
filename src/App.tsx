import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import TrackingSearch from "./pages/TrackingSearch";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminSettings from "./pages/admin/Settings";
import AdminDrivers from "./pages/admin/Drivers";
import DriverLogin from "./pages/driver/Login";
import DriverPanel from "./pages/driver/Panel";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function DriverRoute({ children }: { children: React.ReactNode }) {
  const { isDriver } = useApp();
  if (!isDriver) return <Navigate to="/entregador/login" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/landing" element={<Landing />} />
    <Route path="/" element={<Index />} />
    <Route path="/carrinho" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/pedido/:id" element={<OrderTracking />} />
    <Route path="/rastrear" element={<TrackingSearch />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/admin/pedidos" element={<AdminRoute><AdminOrders /></AdminRoute>} />
    <Route path="/admin/produtos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
    <Route path="/admin/entregadores" element={<AdminRoute><AdminDrivers /></AdminRoute>} />
    <Route path="/admin/config" element={<AdminRoute><AdminSettings /></AdminRoute>} />
    <Route path="/entregador/login" element={<DriverLogin />} />
    <Route path="/entregador" element={<DriverRoute><DriverPanel /></DriverRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
