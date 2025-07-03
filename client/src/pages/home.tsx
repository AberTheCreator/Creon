import { WalletConnection } from '@/components/wallet-connection';
import { CreatorProfile } from '@/components/creator-profile';
import { TokenGatedContent } from '@/components/token-gated-content';
import { TippingSystem } from '@/components/tipping-system';
import { GrantDiscovery } from '@/components/grant-discovery';
import type { WalletConnection as WalletConnectionType } from '@/types';
import type { User } from '@shared/schema';

interface HomeProps {
  wallet: WalletConnectionType | null;
  user: User | null;
  connectWallet: (type: 'metamask' | 'phantom') => void;
  isConnecting: boolean;
}

export default function Home({ wallet, user, connectWallet, isConnecting }: HomeProps) {

  if (!wallet || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <WalletConnection onConnect={connectWallet} isConnecting={isConnecting} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <CreatorProfile user={user} />
      <TokenGatedContent user={user} />
      <TippingSystem user={user} />
      <GrantDiscovery user={user} />
    </div>
  );
}
