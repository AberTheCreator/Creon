import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Users, Rocket, Layers, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Grant, User } from '@shared/schema';

interface GrantDiscoveryProps {
  user: User;
}

const applicationSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  projectDescription: z.string().min(10, "Description must be at least 10 characters"),
  requestedAmount: z.string().min(1, "Requested amount is required"),
  portfolio: z.string().optional(),
});

export function GrantDiscovery({ user }: GrantDiscoveryProps) {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: grants = [] } = useQuery<Grant[]>({
    queryKey: ['/api/grants'],
  });

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      projectTitle: '',
      projectDescription: '',
      requestedAmount: '',
      portfolio: '',
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof applicationSchema>) => {
      if (!selectedGrant) throw new Error('No grant selected');
      
      return apiRequest('POST', '/api/grant-applications', {
        userId: user.id,
        grantId: selectedGrant.id,
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        requestedAmount: data.requestedAmount,
        portfolio: data.portfolio || null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your grant application has been submitted successfully",
      });
      setShowApplication(false);
      setSelectedGrant(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/grant-applications`] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApply = (grant: Grant) => {
    setSelectedGrant(grant);
    setShowApplication(true);
  };

  const onSubmit = (data: z.infer<typeof applicationSchema>) => {
    applicationMutation.mutate(data);
  };

  const getGrantIcon = (organization: string) => {
    switch (organization.toLowerCase()) {
      case 'superteam':
        return <Rocket className="w-5 h-5 text-white" />;
      case 'base':
        return <Layers className="w-5 h-5 text-white" />;
      default:
        return <Plus className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-accent/10 text-accent';
      case 'featured':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Available Grants</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {grants.map((grant) => (
          <div
            key={grant.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => handleApply(grant)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                {getGrantIcon(grant.organization)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800">{grant.title}</h4>
                  <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(grant.status)}`}>
                    {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{grant.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      <Calendar className="w-3 h-3 mr-1 inline" />
                      Due: {new Date(grant.deadline).toLocaleDateString()}
                    </span>
                    <span>
                      <Users className="w-3 h-3 mr-1 inline" />
                      {grant.applicationCount} applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(grant);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Apply Button */}
      <Button className="w-full mt-4 bg-primary hover:bg-primary/80 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Submit New Grant Application
      </Button>

      {/* Application Dialog */}
      <Dialog open={showApplication} onOpenChange={setShowApplication}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedGrant?.title}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project and how it aligns with the grant requirements"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requestedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2500"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-portfolio.com"
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
                  onClick={() => setShowApplication(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={applicationMutation.isPending}
                  className="flex-1"
                >
                  {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
