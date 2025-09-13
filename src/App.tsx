import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueueProvider } from "@/contexts/QueueContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import RegisterHospital from "./pages/RegisterHospital";
import AdminLogin from "./pages/AdminLogin";
import JoinQueue from "./pages/JoinQueue";
import DoctorDashboard from "./pages/DoctorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QueueProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterHospital />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/join-queue" element={<JoinQueue />} />
            <Route path="/dashboard" element={<DoctorDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueueProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
