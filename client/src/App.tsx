import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { FacilityProvider } from "@/lib/facility-context";
import Dashboard from "@/pages/dashboard";
import Book from "@/pages/book";
import ManagerHome from "@/pages/manager/home";
import ManagerUnits from "@/pages/manager/units";
import ManagerLeads from "@/pages/manager/leads";
import ManagerPricing from "@/pages/manager/pricing";
import ManagerRentals from "@/pages/manager/rentals";
import ManagerPayments from "@/pages/manager/payments";
import ManagerReports from "@/pages/manager/reports";
import ManagerLocks from "@/pages/manager/locks";
import ManagerMessaging from "@/pages/manager/messaging";
import ManagerCollections from "@/pages/manager/collections";
import ManagerSiteMap from "@/pages/manager/site-map";
import TenantDetails from "@/pages/manager/tenant-details";
import ManagerGate from "@/pages/manager/gate";
import NotFound from "@/pages/not-found";
import ManagerNotifications from "@/pages/manager/notifications";
import WalkthroughPage from "@/pages/manager/walkthrough";
import SettingsPage from "@/pages/manager/settings";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/manager" />
      </Route>
      <Route path="/book/:id" component={Book} />
      {/* Manager Routes */}
      <Route path="/manager" component={ManagerHome} />
      <Route path="/manager/units" component={ManagerUnits} />
      <Route path="/manager/leads" component={ManagerLeads} />
      <Route path="/manager/pricing" component={ManagerPricing} />
      <Route path="/manager/rentals" component={ManagerRentals} />
      <Route path="/manager/payments" component={ManagerPayments} />
      <Route path="/manager/collections" component={ManagerCollections} />
      <Route path="/manager/site-map" component={ManagerSiteMap} />
      <Route path="/manager/walkthrough" component={WalkthroughPage} />
      <Route path="/manager/reports" component={ManagerReports} />
      <Route path="/manager/locks" component={ManagerLocks} />
      <Route path="/manager/gate" component={ManagerGate} />
      <Route path="/manager/messaging" component={ManagerMessaging} />
      <Route path="/manager/tenant/:id" component={TenantDetails} />
      <Route path="/manager/notifications" component={ManagerNotifications} />
      <Route path="/manager/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FacilityProvider>
        <Router />
        <Toaster />
      </FacilityProvider>
    </QueryClientProvider>
  );
}

export default App;