export const MOCK_WALLET_ADDRESSES = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdef1234567890abcdef1234567890abcdef12',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Solana address format
];

export const connectMetaMask = async (): Promise<{ address: string; type: 'metamask' }> => {
  // Check if MetaMask is available
  if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        return {
          address: accounts[0],
          type: 'metamask'
        };
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw new Error('MetaMask connection failed');
    }
  }
  
  // Fallback to simulation for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    address: MOCK_WALLET_ADDRESSES[0],
    type: 'metamask'
  };
};

export const connectPhantom = async (): Promise<{ address: string; type: 'phantom' }> => {
  // Check if Phantom is available
  if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
    try {
      // Request account access
      const response = await (window as any).solana.connect();
      
      if (response.publicKey) {
        return {
          address: response.publicKey.toString(),
          type: 'phantom'
        };
      }
    } catch (error) {
      console.error('Phantom connection error:', error);
      throw new Error('Phantom connection failed');
    }
  }
  
  // Fallback to simulation for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    address: MOCK_WALLET_ADDRESSES[2],
    type: 'phantom'
  };
};

export const disconnectWallet = async (): Promise<void> => {
  // Simulate wallet disconnection
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
