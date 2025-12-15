import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin";
import ProfilePage from "@/pages/profile";
import PublicProfile from "@/pages/public-profile";
import Search from "@/pages/search";
import Blog from "@/pages/blog";
import Subscribers from "@/pages/subscribers";
import YouTubeSearchPage from "@/pages/youtube-search";
import ApiDocs from "@/pages/api-docs";
import EntityProfile from "@/pages/entity-profile";
import Entities from "@/pages/entities";
import Terms from "@/pages/terms";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/u/:username" component={PublicProfile} />
      <Route path="/entity/:slug" component={EntityProfile} />
      <Route path="/entities" component={Entities} />
      <Route path="/search" component={Search} />
      <Route path="/youtube" component={YouTubeSearchPage} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/blog" component={Blog} />
      <Route path="/subscribers" component={Subscribers} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
