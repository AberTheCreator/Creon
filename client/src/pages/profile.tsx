import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, CheckCircle, Award, FileText, ExternalLink, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatAddress } from '@/lib/wallet';
import type { NFT, GrantApplication, UserStats, User } from '@shared/schema';
import type { WalletConnection } from '@/types';

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  bio: z.string().optional(),
});

interface ProfileProps {
  wallet: WalletConnection | null;
  user: User | null;
}

export default function Profile({ wallet, user }: ProfileProps) {
  const [showEdit, setShowEdit] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nfts = [] } = useQuery<NFT[]>({
    queryKey: [`/api/users/${user?.id}/nfts`],
    enabled: !!user,
  });

  const { data: applications = [] } = useQuery<GrantApplication[]>({
    queryKey: [`/api/users/${user?.id}/grant-applications`],
    enabled: !!user,
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: [`/api/users/${user?.id}/stats`],
    enabled: !!user,
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      title: user?.title || '',
      bio: user?.bio || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      if (!user) throw new Error('No user');
      
      return apiRequest('PATCH', `/api/users/${user.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setShowEdit(false);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    updateMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Please connect your wallet to view profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.title || 'Creator'}</p>
                {user.isVerified && (
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                      Verified Creator
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Digital Artist & Creator" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEdit(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="flex-1"
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {user.bio && (
            <p className="text-gray-600 mb-4">{user.bio}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Wallet: {formatAddress(user.walletAddress || '')}</span>
            <span>•</span>
            <span className="capitalize">{user.walletType}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.creationCount}</div>
              <div className="text-sm text-gray-600">Creations</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">${stats.totalEarnings}</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* NFT Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">NFT Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {nfts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {nfts.map((nft) => (
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
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No NFTs yet</p>
              <p className="text-sm">Start creating to build your collection</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grant Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grant Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{app.projectTitle}</h4>
                    <p className="text-sm text-gray-600">
                      Requested: ${app.requestedAmount}
                    </p>
                  </div>
                  <Badge variant={
                    app.status === 'approved' ? 'default' :
                    app.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No grant applications</p>
              <p className="text-sm">Apply for grants to fund your projects</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {}}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
