export interface WalletConnection {
  address: string;
  type: 'metamask' | 'phantom';
  isConnected: boolean;
}

export interface CreatorStats {
  creationCount: number;
  totalEarnings: string;
  tipCount: number;
  followerCount: number;
}

export interface TippingTarget {
  id: number;
  name: string;
  avatar?: string;
  recentWork?: string;
}
