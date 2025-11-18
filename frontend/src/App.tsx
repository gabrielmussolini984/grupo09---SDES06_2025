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

// Pet pages
import PetList from "./pages/pets/PetList";
import PetForm from "./pages/pets/PetForm";

// Tutor pages
import TutorList from "./pages/tutors/TutorList";
import TutorForm from "./pages/tutors/TutorForm";

// Medical Record pages
import MedicalRecordList from "./pages/medical-records/MedicalRecordList";
import MedicalRecordForm from "./pages/medical-records/MedicalRecordForm";
import PetDetails from "./pages/pets/PetDetails";
import MedicalRecordDetails from "./pages/medical-records/MedicalRecordDetails";

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
            <Route path="/usuarios/:id/editar" element={<UserForm />} />
            
            {/* Pet routes */}
            <Route path="/pets" element={<PetList />} />
            <Route path="/pets/novo" element={<PetForm />} />
            <Route path="/pets/:id/editar" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetDetails />} />

             {/* Tutor routes */}
            <Route path="/tutores" element={<TutorList />} />
            <Route path="/tutores/novo" element={<TutorForm />} />
            <Route path="/tutores/:id/editar" element={<TutorForm />} />

            {/* Medical Record routes */}
            <Route path="/historico-medico" element={<MedicalRecordList />} />
            <Route path="/historico-medico/novo" element={<MedicalRecordForm />} />
            <Route path="/historico-medico/:id/:petId/editar" element={<MedicalRecordForm />} />
            <Route path="/historico-medico/:id/:petId" element={<MedicalRecordDetails />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
