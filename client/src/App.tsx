import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import Modules from "./pages/Modules";
import Transformer from "./pages/Transformer";
import Dashboard from "./pages/Dashboard";
import ApiDocs from "./pages/ApiDocs";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/levels" component={Levels} />
      <Route path="/modules" component={Modules} />
      <Route path="/modules/:levelId" component={Modules} />
      <Route path="/transformer" component={Transformer} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
