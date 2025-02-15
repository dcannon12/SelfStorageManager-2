import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import Book from "@/pages/book";
import ManagerDashboard from "@/pages/manager/dashboard";
import UnitsPage from "@/pages/manager/units";
import TenantsPage from "@/pages/manager/tenants";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/book/:id" component={Book} />
      <Route path="/manager" component={ManagerDashboard} />
      <Route path="/manager/units" component={UnitsPage} />
      <Route path="/manager/tenants" component={TenantsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;