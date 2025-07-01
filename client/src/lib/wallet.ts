export const MOCK_WALLET_ADDRESSES = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdef1234567890abcdef1234567890abcdef12',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Solana address format
];

export const connectMetaMask = async (): Promise<{ address: string; type: 'metamask' }> => {
  // Simulate MetaMask connection
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For MVP, return mock address
  return {
    address: MOCK_WALLET_ADDRESSES[0],
    type: 'metamask'
  };
};

export const connectPhantom = async (): Promise<{ address: string; type: 'phantom' }> => {
  // Simulate Phantom connection
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For MVP, return mock Solana address
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
