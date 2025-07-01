import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';

interface WalletConnectionProps {
  onConnect: (type: 'metamask' | 'phantom') => void;
  isConnecting: boolean;
}

export function WalletConnection({ onConnect, isConnecting }: WalletConnectionProps) {
  return (
    <Card className="m-4 border-gray-100">
      <CardContent className="text-center py-6">
        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-gray-600 mb-6">
          Access Web3 features and start building your creator economy
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => onConnect('metamask')}
            disabled={isConnecting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <span className="mr-2">🦊</span>
            )}
            Connect MetaMask
          </Button>
          
          <Button
            onClick={() => onConnect('phantom')}
            disabled={isConnecting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <span className="mr-2">👻</span>
            )}
            Connect Phantom
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
