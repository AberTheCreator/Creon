import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Key, Lock } from 'lucide-react';
import { checkTokenBalance, checkNFTOwnership } from '@/lib/web3';
import type { TokenGatedContent, User } from '@shared/schema';

interface TokenGatedContentProps {
  user: User;
}

export function TokenGatedContent({ user }: TokenGatedContentProps) {
  const { data: content = [] } = useQuery<TokenGatedContent[]>({
    queryKey: ['/api/token-gated-content'],
  });

  const handleUnlock = async (item: TokenGatedContent) => {
    if (!user.walletAddress) return;
    
    try {
      if (item.requiredTokenType === 'token' && item.requiredTokenAmount) {
        const balance = await checkTokenBalance(user.walletAddress, item.requiredTokenSymbol || '');
        if (balance >= item.requiredTokenAmount) {
          // Simulate unlocking content
          alert(`Unlocked ${item.title}! You have ${balance} ${item.requiredTokenSymbol} tokens.`);
        } else {
          alert(`Insufficient balance. You need ${item.requiredTokenAmount} ${item.requiredTokenSymbol} tokens.`);
        }
      } else if (item.requiredTokenType === 'nft') {
        const hasNFT = await checkNFTOwnership(user.walletAddress, item.requiredContractAddress || '');
        if (hasNFT) {
          alert(`Unlocked ${item.title}! You own the required NFT.`);
        } else {
          alert(`You don't own the required ${item.requiredTokenSymbol} NFT.`);
        }
      }
    } catch (error) {
      alert('Failed to check token requirements. Please try again.');
    }
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Premium Templates</h3>
        <Crown className="w-5 h-5 text-secondary" />
      </div>
      
      <div className="space-y-3">
        {content.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              item.requiredTokenType === 'token'
                ? 'bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20'
                : 'bg-gray-50 opacity-60'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className={`w-12 h-12 object-cover rounded-lg ${
                item.requiredTokenType === 'nft' ? 'filter grayscale' : ''
              }`}
            />
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-600">{item.description}</p>
              <div className="flex items-center space-x-1 mt-1">
                {item.requiredTokenType === 'token' ? (
                  <>
                    <Key className="w-3 h-3 text-secondary" />
                    <span className="text-xs text-secondary font-medium">
                      Requires {item.requiredTokenAmount} {item.requiredTokenSymbol} tokens
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Need {item.requiredTokenSymbol} NFT
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={() => handleUnlock(item)}
              disabled={item.requiredTokenType === 'nft'}
              className={
                item.requiredTokenType === 'token'
                  ? 'bg-secondary hover:bg-secondary/80 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            >
              {item.requiredTokenType === 'token' ? 'Unlock' : 'Locked'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
