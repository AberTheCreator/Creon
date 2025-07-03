import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface WalletConnectionProps {
  onConnect: (type: 'metamask' | 'phantom') => void;
  isConnecting: boolean;
}

export function WalletConnection({ onConnect, isConnecting }: WalletConnectionProps) {
  const [walletAvailability, setWalletAvailability] = useState({
    metamask: false,
    phantom: false
  });

  useEffect(() => {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check wallet availability
    const checkWallets = () => {
      if (isMobile) {
        // On mobile, we assume wallets might be available via deep links
        // We'll check for common user agents or assume they're installed
        setWalletAvailability({
          metamask: true, // Assume MetaMask is available on mobile for connection attempt
          phantom: true   // Assume Phantom is available on mobile for connection attempt
        });
      } else {
        // Desktop detection - check for injected objects
        setWalletAvailability({
          metamask: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
          phantom: typeof window !== 'undefined' && !!(window as any).solana?.isPhantom
        });
      }
    };

    checkWallets();
    
    // Listen for wallet injection (mainly for desktop)
    if (!isMobile) {
      const interval = setInterval(checkWallets, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleMetaMaskConnect = () => {
    // Always try to connect first, let the wallet library handle the connection logic
    onConnect('metamask');
  };

  const handlePhantomConnect = () => {
    // Always try to connect first, let the wallet library handle the connection logic  
    onConnect('phantom');
  };

  return (
    <Card className="m-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardContent className="text-center py-6">
        <Wallet className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Access Web3 features and start building your creator economy
        </p>
        
        <div className="space-y-3">
          {/* MetaMask Button */}
          <div className="relative">
            <Button
              onClick={handleMetaMaskConnect}
              disabled={isConnecting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="mr-2">🦊</span>
              )}
              Connect MetaMask
            </Button>
            <div className="absolute -top-2 -right-2">
              {walletAvailability.metamask ? (
                <Badge className="bg-green-500 text-white text-xs p-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                </Badge>
              ) : (
                <Badge className="bg-gray-400 text-white text-xs p-1 rounded-full">
                  <XCircle className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>
          
          {/* Phantom Button */}
          <div className="relative">
            <Button
              onClick={handlePhantomConnect}
              disabled={isConnecting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="mr-2">👻</span>
              )}
              Connect Phantom
            </Button>
            <div className="absolute -top-2 -right-2">
              {walletAvailability.phantom ? (
                <Badge className="bg-green-500 text-white text-xs p-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                </Badge>
              ) : (
                <Badge className="bg-gray-400 text-white text-xs p-1 rounded-full">
                  <XCircle className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Click to connect your wallet. On mobile, this will open your wallet app.
        </p>
      </CardContent>
    </Card>
  );
}
