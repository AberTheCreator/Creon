import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { simulateTransaction } from '@/lib/web3';
import type { User } from '@shared/schema';

interface TippingSystemProps {
  user: User;
}

export function TippingSystem({ user }: TippingSystemProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock featured creator for tipping
  const featuredCreator = {
    id: 999, // Mock ID
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
    recentWork: "Just shared an amazing template"
  };

  const tipMutation = useMutation({
    mutationFn: async (amount: number) => {
      // Simulate blockchain transaction
      await simulateTransaction(amount.toString(), 'USDC');
      
      // Create tip record
      return apiRequest('POST', '/api/tips', {
        fromUserId: user.id,
        toUserId: featuredCreator.id,
        amount: amount.toString(),
        currency: 'USDC',
        message: `Tip from ${user.name}`,
      });
    },
    onSuccess: () => {
      toast({
        title: "Tip Sent!",
        description: `Successfully sent $${selectedAmount} USDC tip`,
      });
      setSelectedAmount(null);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/tips`] });
    },
    onError: () => {
      toast({
        title: "Tip Failed",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const tipAmounts = [1, 5, 10];

  const handleSendTip = () => {
    if (selectedAmount) {
      tipMutation.mutate(selectedAmount);
    }
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">Support Creators</h3>
      
      <Card className="creon-accent-gradient/10 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
              {featuredCreator.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{featuredCreator.name}</h4>
              <p className="text-xs text-gray-600">{featuredCreator.recentWork}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-3">
            {tipAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAmount(amount)}
                className="flex-1 flex-col py-2 px-3"
              >
                <div className="text-sm font-bold">${amount}</div>
                <div className="text-xs">USDC</div>
              </Button>
            ))}
          </div>
          
          <Button
            onClick={handleSendTip}
            disabled={!selectedAmount || tipMutation.isPending}
            className="w-full bg-accent hover:bg-accent/80 text-white"
          >
            {tipMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Heart className="w-4 h-4 mr-2" />
            )}
            Send Tip
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
