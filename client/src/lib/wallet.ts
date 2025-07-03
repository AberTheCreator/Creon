export const MOCK_WALLET_ADDRESSES = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdef1234567890abcdef1234567890abcdef12',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Solana address format
];

export const connectMetaMask = async (): Promise<{ address: string; type: 'metamask' }> => {
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check if MetaMask is available (desktop)
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
  
  // Mobile deep link for MetaMask
  if (isMobile) {
    const dappUrl = encodeURIComponent(window.location.href);
    const metamaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
    
    // Try to open MetaMask app
    window.location.href = metamaskDeepLink;
    
    // For demo purposes, return a mock address after attempting deep link
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      address: MOCK_WALLET_ADDRESSES[0],
      type: 'metamask'
    };
  }
  
  // Fallback to simulation for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    address: MOCK_WALLET_ADDRESSES[0],
    type: 'metamask'
  };
};

export const connectPhantom = async (): Promise<{ address: string; type: 'phantom' }> => {
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check if Phantom is available (desktop)
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
  
  // Mobile deep link for Phantom
  if (isMobile) {
    const dappUrl = encodeURIComponent(window.location.href);
    const phantomDeepLink = `https://phantom.app/ul/browse/${dappUrl}?ref=${window.location.hostname}`;
    
    // Try to open Phantom app
    window.location.href = phantomDeepLink;
    
    // For demo purposes, return a mock address after attempting deep link
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      address: MOCK_WALLET_ADDRESSES[2],
      type: 'phantom'
    };
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
