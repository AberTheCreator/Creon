import { WalletConnection } from '@/components/wallet-connection';
import { CreatorProfile } from '@/components/creator-profile';
import { TokenGatedContent } from '@/components/token-gated-content';
import { TippingSystem } from '@/components/tipping-system';
import { GrantDiscovery } from '@/components/grant-discovery';
import { useWallet } from '@/hooks/use-wallet';

export default function Home() {
  const { wallet, user, isConnecting, connectWallet } = useWallet();

  if (!wallet || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WalletConnection onConnect={connectWallet} isConnecting={isConnecting} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <CreatorProfile user={user} />
      <TokenGatedContent user={user} />
      <TippingSystem user={user} />
      <GrantDiscovery user={user} />
    </div>
  );
}
