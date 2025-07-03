import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image, Video, FileText, Palette } from 'lucide-react';
import type { WalletConnection } from '@/types';
import type { User } from '@shared/schema';

interface CreateProps {
  wallet: WalletConnection | null;
  user: User | null;
}

export default function Create({ wallet, user }: CreateProps) {
  const createOptions = [
    {
      title: 'Design Template',
      description: 'Create custom templates for the community',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'NFT Collection',
      description: 'Mint and showcase your digital art',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Video Content',
      description: 'Create engaging video content',
      icon: Video,
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'Written Content',
      description: 'Share articles and tutorials',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Something Amazing</h2>
        <p className="text-gray-600">Choose what you'd like to create and share with the community</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {createOptions.map((option) => (
          <Card key={option.title} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center mb-3`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{option.title}</h3>
              <p className="text-xs text-gray-600">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Creations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent creations</p>
            <p className="text-sm">Start creating to see your work here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
