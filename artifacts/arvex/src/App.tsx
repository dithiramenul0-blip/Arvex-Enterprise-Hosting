import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import ContentPage from "@/pages/ContentPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

import { ClientLayout } from "@/components/ClientLayout";
import ClientDashboard from "@/pages/client/Dashboard";
import ClientServices from "@/pages/client/Services";
import ClientOrders from "@/pages/client/Orders";
import ClientTickets from "@/pages/client/Tickets";
import NewTicket from "@/pages/client/NewTicket";
import TicketDetail from "@/pages/client/TicketDetail";
import ClientProfile from "@/pages/client/Profile";

import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminPlans from "@/pages/admin/Plans";
import AdminServices from "@/pages/admin/Services";
import AdminTickets from "@/pages/admin/Tickets";
import AdminPartners from "@/pages/admin/Partners";
import AdminContent from "@/pages/admin/Content";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && user.role !== 'admin') {
    setLocation("/client");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vps">{(params) => <Plans category="vps" title="VPS Hosting" />}</Route>
      <Route path="/minecraft">{(params) => <Plans category="minecraft" title="Minecraft Hosting" />}</Route>
      <Route path="/bot-hosting">{(params) => <Plans category="bot" title="Bot Hosting" />}</Route>
      <Route path="/vds">{(params) => <Plans category="vds" title="VDS Hosting" />}</Route>
      <Route path="/web-hosting">{(params) => <Plans category="web" title="Web Hosting" />}</Route>
      
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      <Route path="/terms">{(params) => <ContentPage slug="terms" />}</Route>
      <Route path="/privacy">{(params) => <ContentPage slug="privacy" />}</Route>
      <Route path="/refund">{(params) => <ContentPage slug="refund" />}</Route>
      <Route path="/sla">{(params) => <ContentPage slug="sla" />}</Route>
      <Route path="/aup">{(params) => <ContentPage slug="aup" />}</Route>

      {/* Client Routes */}
      <Route path="/client/*">
        <ProtectedRoute component={() => (
          <ClientLayout>
            <Switch>
              <Route path="/client" component={ClientDashboard} />
              <Route path="/client/services" component={ClientServices} />
              <Route path="/client/orders" component={ClientOrders} />
              <Route path="/client/tickets" component={ClientTickets} />
              <Route path="/client/tickets/new" component={NewTicket} />
              <Route path="/client/tickets/:id">{(params) => <TicketDetail id={params.id!} />}</Route>
              <Route path="/client/profile" component={ClientProfile} />
            </Switch>
          </ClientLayout>
        )} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*">
        <ProtectedRoute adminOnly component={() => (
          <AdminLayout>
            <Switch>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/plans" component={AdminPlans} />
              <Route path="/admin/services" component={AdminServices} />
              <Route path="/admin/tickets" component={AdminTickets} />
              <Route path="/admin/partners" component={AdminPartners} />
              <Route path="/admin/content" component={AdminContent} />
            </Switch>
          </AdminLayout>
        )} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
