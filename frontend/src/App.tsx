import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// User pages
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import UserDetails from "./pages/users/UserDetails";

// Pet pages
import PetList from "./pages/pets/PetList";
import PetForm from "./pages/pets/PetForm";
import PetDetails from "./pages/pets/PetDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* User routes */}
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/usuarios/novo" element={<UserForm />} />
            <Route path="/usuarios/:id" element={<UserDetails />} />
            <Route path="/usuarios/:id/editar" element={<UserForm />} />
            
            {/* Pet routes */}
            <Route path="/pets" element={<PetList />} />
            <Route path="/pets/novo" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetDetails />} />
            <Route path="/pets/:id/editar" element={<PetForm />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
