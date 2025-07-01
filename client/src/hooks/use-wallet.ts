import { useState, useCallback } from 'react';
import { connectMetaMask, connectPhantom, disconnectWallet } from '@/lib/wallet';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { WalletConnection } from '@/types';
import type { User } from '@shared/schema';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = useCallback(async (type: 'metamask' | 'phantom') => {
    setIsConnecting(true);
    try {
      let connection;
      
      if (type === 'metamask') {
        connection = await connectMetaMask();
      } else {
        connection = await connectPhantom();
      }

      // Connect to backend
      const response = await apiRequest('POST', '/api/wallet/connect', {
        walletAddress: connection.address,
        walletType: connection.type,
      });
      
      const userData = await response.json();
      
      setWallet({
        address: connection.address,
        type: connection.type,
        isConnected: true,
      });
      
      setUser(userData);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${type}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet();
      setWallet(null);
      setUser(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    wallet,
    user,
    isConnecting,
    connectWallet,
    disconnect,
    isConnected: wallet?.isConnected ?? false,
  };
};
