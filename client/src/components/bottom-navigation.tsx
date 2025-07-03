import { Button } from '@/components/ui/button';
import { Home, PlusCircle, Store, TrendingUp, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'marketplace', label: 'Market', icon: Store },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center space-y-1 py-2 px-3 ${
              activeTab === id ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'
            }`}
          >
            <Icon className={`${id === 'create' ? 'w-6 h-6' : 'w-5 h-5'} ${id === 'create' && activeTab === id ? 'scale-110 transition-transform' : ''}`} />
            <span className={`text-xs font-medium ${id === 'create' ? 'font-semibold' : ''}`}>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
