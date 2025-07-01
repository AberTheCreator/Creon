import { apiRequest } from "./queryClient";

export const simulateTransaction = async (amount: string, currency: string = 'USDC'): Promise<string> => {
  // Simulate blockchain transaction
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock transaction hash
  return `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
};

export const checkTokenBalance = async (address: string, tokenSymbol: string): Promise<number> => {
  // Mock token balance check
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock balance
  if (tokenSymbol === 'CREATOR') return Math.floor(Math.random() * 10);
  if (tokenSymbol === 'USDC') return Math.floor(Math.random() * 1000);
  
  return 0;
};

export const checkNFTOwnership = async (address: string, contractAddress: string): Promise<boolean> => {
  // Mock NFT ownership check
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock ownership status
  return Math.random() > 0.5;
};
