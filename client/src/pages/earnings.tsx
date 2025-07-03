import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Heart, Award, Download, ExternalLink } from 'lucide-react';
import type { Tip, UserStats } from '@shared/schema';
import type { WalletConnection } from '@/types';
import type { User } from '@shared/schema';

interface EarningsProps {
  wallet: WalletConnection | null;
  user: User | null;
}

export default function Earnings({ wallet, user }: EarningsProps) {

  const { data: stats } = useQuery<UserStats>({
    queryKey: [`/api/users/${user?.id}/stats`],
    enabled: !!user,
  });

  const { data: tips = [] } = useQuery<Tip[]>({
    queryKey: [`/api/users/${user?.id}/tips`],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Please connect your wallet to view earnings</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const receivedTips = tips.filter(tip => tip.toUserId === user.id);
  const sentTips = tips.filter(tip => tip.fromUserId === user.id);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Earnings Dashboard</h2>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Earned</p>
                <p className="text-lg font-bold text-accent">${stats?.totalEarnings || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tips Received</p>
                <p className="text-lg font-bold text-secondary">{stats?.tipCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Heart className="w-4 h-4 text-accent" />
              <div>
                <p className="font-medium">Tips</p>
                <p className="text-sm text-gray-600">{receivedTips.length} received</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-accent">
                ${receivedTips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Download className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium">Template Sales</p>
                <p className="text-sm text-gray-600">Premium downloads</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">$0.00</p>
              <p className="text-xs text-gray-500">Coming soon</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Award className="w-4 h-4 text-secondary" />
              <div>
                <p className="font-medium">Grant Rewards</p>
                <p className="text-sm text-gray-600">Approved applications</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">$0.00</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Tips</CardTitle>
        </CardHeader>
        <CardContent>
          {receivedTips.length > 0 ? (
            <div className="space-y-3">
              {receivedTips.slice(0, 5).map((tip) => (
                <div key={tip.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      T
                    </div>
                    <div>
                      <p className="font-medium">Tip received</p>
                      <p className="text-sm text-gray-600">
                        {new Date(tip.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">+${tip.amount} {tip.currency}</p>
                    <Badge variant="secondary" className="text-xs">
                      {tip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tips received yet</p>
              <p className="text-sm">Share your work to start earning tips!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
