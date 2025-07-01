import { useState } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useWallet } from "@/hooks/use-wallet";
import Home from "@/pages/home";
import Create from "@/pages/create";
import Marketplace from "@/pages/marketplace";
import Earnings from "@/pages/earnings";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const [activeTab, setActiveTab] = useState('home');
  const { wallet, user, disconnect } = useWallet();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'create':
        return <Create />;
      case 'marketplace':
        return <Marketplace />;
      case 'earnings':
        return <Earnings />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl h-screen flex flex-col overflow-hidden">
      <Header wallet={wallet} user={user} onDisconnect={disconnect} />
      
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
