import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Eye, Download } from 'lucide-react';

import type { WalletConnection } from '@/types';
import type { User } from '@shared/schema';

interface MarketplaceProps {
  wallet: WalletConnection | null;
  user: User | null;
}

export default function Marketplace({ wallet, user }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const marketplaceItems = [
    {
      id: 1,
      title: 'Minimal Business Cards',
      creator: 'Alex Rivera',
      price: '0.5 ETH',
      rating: 4.8,
      downloads: 234,
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200',
      category: 'templates',
      type: 'Premium'
    },
    {
      id: 2,
      title: 'Abstract Art Collection',
      creator: 'Sarah Chen',
      price: '1.2 ETH',
      rating: 4.9,
      downloads: 89,
      image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=300&h=200',
      category: 'nfts',
      type: 'Exclusive'
    },
    {
      id: 3,
      title: 'Social Media Templates',
      creator: 'Mike Johnson',
      price: 'Free',
      rating: 4.6,
      downloads: 1.2,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200',
      category: 'templates',
      type: 'Free'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'templates', label: 'Templates' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'tools', label: 'Tools' },
    { id: 'assets', label: 'Assets' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.category === selectedCategory);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Marketplace</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">by {item.creator}</p>
                    </div>
                    <Badge variant={item.type === 'Free' ? 'secondary' : 'default'}>
                      {item.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                        {typeof item.downloads === 'number' && item.downloads > 1000 
                          ? `${(item.downloads / 1000).toFixed(1)}k` 
                          : item.downloads}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-primary">{item.price}</span>
                      <Button size="sm">
                        {item.price === 'Free' ? 'Download' : 'Buy'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No items found in this category</p>
              <p className="text-sm">Try selecting a different category</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
