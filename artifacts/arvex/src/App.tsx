import { useEffect } from "react";
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

import AdminPterodactyl from "@/pages/admin/Pterodactyl";
import AdminProxmox from "@/pages/admin/Proxmox";
import AdminPlanMappings from "@/pages/admin/PlanMappings";
import AdminProvisions from "@/pages/admin/Provisions";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLocation("/login");
    } else if (adminOnly && user.role !== "admin") {
      setLocation("/client");
    }
  }, [isLoading, user, adminOnly, setLocation]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (adminOnly && user.role !== "admin") {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vps">{() => <Plans category="vps" title="VPS Hosting" />}</Route>
      <Route path="/minecraft">{() => <Plans category="minecraft" title="Minecraft Hosting" />}</Route>
      <Route path="/bot-hosting">{() => <Plans category="bot" title="Bot Hosting" />}</Route>
      <Route path="/vds">{() => <Plans category="vds" title="VDS Hosting" />}</Route>
      <Route path="/web-hosting">{() => <Plans category="web" title="Web Hosting" />}</Route>
      <Route path="/v2ray">{() => <Plans category="v2ray" title="V2Ray Proxy" />}</Route>

      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      <Route path="/terms">{() => <ContentPage slug="terms" />}</Route>
      <Route path="/privacy">{() => <ContentPage slug="privacy" />}</Route>
      <Route path="/refund">{() => <ContentPage slug="refund" />}</Route>
      <Route path="/sla">{() => <ContentPage slug="sla" />}</Route>
      <Route path="/aup">{() => <ContentPage slug="aup" />}</Route>

      <Route path="/client">
        <ProtectedRoute component={() => <ClientLayout><ClientDashboard /></ClientLayout>} />
      </Route>
      <Route path="/client/:rest*">
        <ProtectedRoute component={() => (
          <ClientLayout>
            <Switch>
              <Route path="/client/services" component={ClientServices} />
              <Route path="/client/orders" component={ClientOrders} />
              <Route path="/client/tickets/new" component={NewTicket} />
              <Route path="/client/tickets/:id">{(params) => <TicketDetail id={params.id!} />}</Route>
              <Route path="/client/tickets" component={ClientTickets} />
              <Route path="/client/profile" component={ClientProfile} />
              <Route component={NotFound} />
            </Switch>
          </ClientLayout>
        )} />
      </Route>

      <Route path="/admin">
        <ProtectedRoute adminOnly component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      </Route>
      <Route path="/admin/:rest*">
        <ProtectedRoute adminOnly component={() => (
          <AdminLayout>
            <Switch>
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/plans" component={AdminPlans} />
              <Route path="/admin/services" component={AdminServices} />
              <Route path="/admin/tickets" component={AdminTickets} />
              <Route path="/admin/partners" component={AdminPartners} />
              <Route path="/admin/content" component={AdminContent} />
              <Route path="/admin/pterodactyl" component={AdminPterodactyl} />
              <Route path="/admin/proxmox" component={AdminProxmox} />
              <Route path="/admin/plan-mappings" component={AdminPlanMappings} />
              <Route path="/admin/provisions" component={AdminProvisions} />
              <Route component={NotFound} />
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
