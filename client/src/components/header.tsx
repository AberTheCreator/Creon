import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Wallet, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { formatAddress } from '@/lib/wallet';
import { useTheme } from '@/hooks/use-theme';
import type { WalletConnection } from '@/types';
import type { User } from '@shared/schema';

interface HeaderProps {
  wallet: WalletConnection | null;
  user: User | null;
  onDisconnect: () => void;
}

export function Header({ wallet, user, onDisconnect }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="creon-gradient p-4 text-white dark:text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">C</span>
          </div>
          <h1 className="text-xl font-bold">Creon</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-white hover:bg-white/20 p-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {wallet && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm hover:bg-white/30"
                >
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>{formatAddress(wallet.address)}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user?.name || 'Creator'}</p>
                      <p className="text-xs text-muted-foreground">{formatAddress(wallet.address)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      onDisconnect();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}