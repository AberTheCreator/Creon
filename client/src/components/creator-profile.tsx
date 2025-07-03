import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Plus } from 'lucide-react';
import type { User, NFT, UserStats } from '@shared/schema';

interface CreatorProfileProps {
  user: User;
}

export function CreatorProfile({ user }: CreatorProfileProps) {
  const [showAllNFTs, setShowAllNFTs] = useState(false);

  const { data: nfts = [] } = useQuery<NFT[]>({
    queryKey: [`/api/users/${user.id}/nfts`],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: [`/api/users/${user.id}/stats`],
  });

  const displayNFTs = showAllNFTs ? nfts : nfts.slice(0, 3);

  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
          {user.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.title || 'Creator'}</p>
          {user.isVerified && (
            <div className="flex items-center space-x-2 mt-1">
              <CheckCircle className="w-4 h-4 text-accent" />
              <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                Verified Creator
              </Badge>
            </div>
          )}
        </div>
        
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* NFT Collection Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Your NFTs</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllNFTs(!showAllNFTs)}
            className="text-primary"
          >
            {showAllNFTs ? 'Show Less' : 'View All'}
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {displayNFTs.map((nft) => (
            <div
              key={nft.id}
              className="aspect-square rounded-lg overflow-hidden border hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {!showAllNFTs && (
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Creator Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{stats.creationCount}</div>
            <div className="text-xs text-gray-600">Creations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">${stats.totalEarnings}</div>
            <div className="text-xs text-gray-600">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{stats.tipCount}</div>
            <div className="text-xs text-gray-600">Tips</div>
          </div>
        </div>
      )}
    </div>
  );
}
