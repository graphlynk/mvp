import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/GraphlynkSidebar';
import { Header } from '@/components/GraphlynkHeader';
import { GraphlynkThemeProvider } from '@/context/GraphlynkThemeContext';
import { TabId, Tier } from '@/types/graphlynk';
import { Toaster, toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

import { DashboardContent } from '@/components/graphlynk-dashboard/DashboardContent';
import { SearchContent } from '@/components/graphlynk-search/SearchContent';
import { KeywordsContent } from '@/components/graphlynk-keywords/KeywordsContent';
import { IndexationContent } from '@/components/graphlynk-indexation/IndexationContent';
import { SchemaContent } from '@/components/graphlynk-schema/SchemaContent';
import { LLMContent } from '@/components/graphlynk-llm/LLMContent';
import { ProfileContent } from '@/components/graphlynk-profile/ProfileContent';
import { BlogContent } from '@/components/graphlynk-dashboard-blog/BlogContent';
import { ProductsContent } from '@/components/graphlynk-products/ProductsContent';
import { PricingContent } from '@/components/graphlynk-pricing/PricingContent';
import { MessagesContent } from '@/components/graphlynk-messages/MessagesContent';
import { HelpContent } from '@/components/graphlynk-help/HelpContent';
import { SettingsContent } from '@/components/graphlynk-settings/SettingsContent';

import type { User } from '@shared/schema';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [, setLocation] = useLocation();

  const { data: currentUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/user/me'],
  });

  const mapPlanToTier = (plan?: string): Tier => {
    if (!plan) return 'free';
    const normalizedPlan = plan.toUpperCase();
    if (normalizedPlan === 'AUTHORITY') return 'platinum';
    if (normalizedPlan === 'PRO') return 'premium';
    return 'free';
  };

  const tier = mapPlanToTier(currentUser?.plan);

  const updatePlanMutation = useMutation({
    mutationFn: async (newTier: Tier): Promise<User> => {
      const planMap: Record<Tier, string> = {
        free: 'FREE',
        premium: 'PRO',
        platinum: 'AUTHORITY',
      };
      
      const response = await fetch('/api/user/plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planMap[newTier] }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || 'Failed to update plan');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Update the cache with the new user data immediately
      queryClient.setQueryData(['/api/user/me'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/user/me'] });
      toast.success('Plan updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to update plan. Please try again.';
      toast.error(errorMessage);
      console.error('Plan update error:', error);
    },
  });

  const handleTierChange = (newTier: Tier) => {
    if (newTier === tier) {
      toast.info('You are already on this plan');
      return;
    }
    
    if (updatePlanMutation.isPending) {
      toast.warning('Plan update in progress...');
      return;
    }
    
    updatePlanMutation.mutate(newTier);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      setLocation('/login');
    }
  }, [isLoadingUser, currentUser, setLocation]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0F1216]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-[#0b3d84] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent tier={tier} />;
      case 'search':
        return <SearchContent tier={tier} />;
      case 'keywords':
        return <KeywordsContent tier={tier} />;
      case 'indexation':
        return <IndexationContent tier={tier} />;
      case 'schema':
        return <SchemaContent tier={tier} />;
      case 'llm':
        return <LLMContent tier={tier} />;
      case 'profile':
        return <ProfileContent tier={tier} />;
      case 'blog':
        return <BlogContent tier={tier} />;
      case 'products':
        return <ProductsContent tier={tier} />;
      case 'pricing':
        return <PricingContent tier={tier} onTierChange={handleTierChange} />;
      case 'messages':
        return <MessagesContent tier={tier} />;
      case 'help':
        return <HelpContent tier={tier} />;
      case 'settings':
        return <SettingsContent tier={tier} />;
      default:
        return <DashboardContent tier={tier} />;
    }
  };

  return (
    <GraphlynkThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-[#0F1216] overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tier={tier} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header tier={tier} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto p-8">
            {renderContent()}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </GraphlynkThemeProvider>
  );
}
