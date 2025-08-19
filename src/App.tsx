import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { WorkflowProvider } from "@/contexts/WorkflowProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// logique workflow
import { useWorkflowCheck } from "@/hooks/useWorkflowCheck";
import InitializationWizard from "@/components/InitializationWizard";

import { WorkflowStep } from "@/types/workflow.types";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isChecking, currentStep } = useWorkflowCheck();

  useEffect(() => {
    console.log("🚦 Workflow debug:", {
      currentStep,
      env: import.meta.env.MODE,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    });
  }, [currentStep]);

  if (isChecking || currentStep === "loading") {
    return <div>⏳ Chargement du workflow...</div>;
  }

  // Si pas encore arrivé au "dashboard" → lancer le wizard
  if (currentStep !== "dashboard") {
    return (
      <InitializationWizard
        isOpen={true}
        onComplete={() => console.log("🎉 Workflow terminé")}
        startStep={currentStep as WorkflowStep}
      />
    );
  }

  // Workflow complet → layout normal
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <WorkflowProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </WorkflowProvider>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
