import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Subscriber, User, insertSubscriberSchema, type InsertSubscriber } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Mail, Calendar, ArrowLeft, Users } from "lucide-react";
import { z } from "zod";

// Schema for subscriber form (without userId since we'll add it on submit)
const subscriberFormSchema = z.object({
  email: z.string().email("Valid email is required"),
});

type SubscriberFormValues = z.infer<typeof subscriberFormSchema>;

export default function Subscribers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data: subscribers, isLoading } = useQuery<Subscriber[]>({
    queryKey: ["/api/subscribers"],
  });

  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertSubscriber) => {
      return apiRequest("POST", "/api/mailing/subscribe", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscribers"] });
      toast({
        title: "Subscriber Added!",
        description: "The email has been added to your mailing list",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add subscriber",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (user.plan === "FREE") {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[80vh] px-8">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Pro to unlock mailing list management and newsletter features
            </p>
            <Button>Upgrade to Pro</Button>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = (values: SubscriberFormValues) => {
    if (!user) return;
    
    addMutation.mutate({
      userId: user.id,
      email: values.email,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-subscribers-title">Mailing List</h1>
              <p className="text-sm text-muted-foreground">Manage your email subscribers</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-subscriber">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Subscriber</DialogTitle>
                <DialogDescription>
                  Manually add an email to your mailing list
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="subscriber@example.com"
                            {...field}
                            data-testid="input-subscriber-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-subscriber"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addMutation.isPending}
                      data-testid="button-save-subscriber"
                    >
                      {addMutation.isPending ? "Adding..." : "Add Subscriber"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card data-testid="card-stat-total">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">Total Subscribers</CardDescription>
              <CardTitle className="text-4xl font-bold">{subscribers?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card data-testid="card-stat-week">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">This Week</CardDescription>
              <CardTitle className="text-4xl font-bold">0</CardTitle>
            </CardHeader>
          </Card>
          <Card data-testid="card-stat-month">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">This Month</CardDescription>
              <CardTitle className="text-4xl font-bold">0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Subscriber List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading subscribers...</p>
          </div>
        ) : subscribers && subscribers.length > 0 ? (
          <Card data-testid="card-subscribers-list">
            <CardHeader>
              <CardTitle>All Subscribers</CardTitle>
              <CardDescription>
                Your email subscriber list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {subscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="py-4 flex items-center justify-between gap-4"
                    data-testid={`subscriber-${subscriber.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" data-testid={`subscriber-email-${subscriber.id}`}>
                          {subscriber.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {new Date(subscriber.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`button-remove-${subscriber.id}`}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card data-testid="card-empty-subscribers">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Subscribers Yet</h3>
              <p className="mb-6 max-w-md mx-auto">
                Start building your email list to send newsletters and engage with your audience.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-subscriber">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Subscriber
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Newsletter Info */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20" data-testid="card-newsletter-info">
          <CardHeader>
            <CardTitle>Weekly Newsletter Digest</CardTitle>
            <CardDescription>
              Automatically send your latest blog posts to subscribers every week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The weekly digest script runs every Monday and sends your latest blog posts to all subscribers.
              Run manually using: <code className="bg-muted px-2 py-1 rounded text-xs">npm run digest</code>
            </p>
            <Button variant="outline" data-testid="button-send-digest">
              Send Test Newsletter
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
