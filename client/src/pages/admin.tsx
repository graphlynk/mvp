import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket, Activity, Shield, Edit, UserCog, LogOut } from 'lucide-react';
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { User, SupportTicket } from '@shared/schema';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editTicketDialogOpen, setEditTicketDialogOpen] = useState(false);

  type AdminStats = {
    totalUsers?: number;
    openTickets?: number;
    recentActivity?: unknown[];
  };

  type UsersResponse = { users: User[] };
  type ActivityLog = { id: string; action: string; details: string; createdAt: string };

  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/user/me'],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: !!currentUser?.isAdmin,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery<UsersResponse>({
    queryKey: ['/api/admin/users'],
    enabled: !!currentUser?.isAdmin,
  });

  const { data: tickets, isLoading: isLoadingTickets } = useQuery<SupportTicket[]>({
    queryKey: ['/api/admin/tickets'],
    enabled: !!currentUser?.isAdmin,
  });

  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery<ActivityLog[]>({
    queryKey: ['/api/admin/activity-logs'],
    enabled: !!currentUser?.isAdmin,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/users/${userId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setEditUserDialogOpen(false);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/tickets/${ticketId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setEditTicketDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive',
      });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('POST', `/api/admin/impersonate/${userId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Impersonating User',
        description: `You are now impersonating ${data.targetUser.email}. The page will reload.`,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to impersonate user',
        variant: 'destructive',
      });
    },
  });

  const exitImpersonationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/exit-impersonation');
    },
    onSuccess: () => {
      toast({
        title: 'Exited Impersonation',
        description: 'Returned to admin account. The page will reload.',
      });
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    },
  });

  if (!currentUser) {
    return null;
  }

  if (!currentUser.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" data-testid="icon-access-denied" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => setLocation('/dashboard')} data-testid="button-go-dashboard">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const isImpersonating = (currentUser as any).isImpersonating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, support tickets, and system settings
            </p>
          </div>
          {isImpersonating && (
            <Button
              variant="destructive"
              onClick={() => exitImpersonationMutation.mutate()}
              disabled={exitImpersonationMutation.isPending}
              data-testid="button-exit-impersonation"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit Impersonation
            </Button>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="tickets" data-testid="tab-tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <h3 className="text-3xl font-bold" data-testid="stat-total-users">
                      {isLoadingStats ? '...' : stats?.totalUsers || 0}
                    </h3>
                  </div>
                  <Users className="w-12 h-12 text-primary opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
                    <h3 className="text-3xl font-bold" data-testid="stat-open-tickets">
                      {isLoadingStats ? '...' : stats?.openTickets || 0}
                    </h3>
                  </div>
                  <Ticket className="w-12 h-12 text-orange-500 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recent Activity</p>
                    <h3 className="text-3xl font-bold" data-testid="stat-recent-activity">
                      {isLoadingStats ? '...' : stats?.recentActivity?.length || 0}
                    </h3>
                  </div>
                  <Activity className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              {isLoadingUsers ? (
                <div className="text-center py-8 text-muted-foreground">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Plan</th>
                        <th className="text-left py-3 px-4">Admin</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData?.users?.map((user: User) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50" data-testid={`user-row-${user.id}`}>
                          <td className="py-3 px-4" data-testid={`user-email-${user.id}`}>{user.email}</td>
                          <td className="py-3 px-4">{user.name || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.plan === 'AUTHORITY' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              user.plan === 'PRO' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {user.isAdmin ? '✓' : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditUserDialogOpen(true);
                                }}
                                data-testid={`button-edit-user-${user.id}`}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => impersonateMutation.mutate(user.id)}
                                disabled={impersonateMutation.isPending}
                                data-testid={`button-impersonate-${user.id}`}
                              >
                                <UserCog className="w-3 h-3 mr-1" />
                                Impersonate
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
              {isLoadingTickets ? (
                <div className="text-center py-8 text-muted-foreground">Loading tickets...</div>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket: any) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/30" data-testid={`ticket-${ticket.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{ticket.message}</p>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              ticket.status === 'resolved' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {ticket.status}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setEditTicketDialogOpen(true);
                          }}
                          data-testid={`button-edit-ticket-${ticket.id}`}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No support tickets found</div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Admin Activity Logs</h2>
              {isLoadingLogs ? (
                <div className="text-center py-8 text-muted-foreground">Loading activity logs...</div>
              ) : activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-2">
                  {activityLogs.map((log: any) => (
                    <div key={log.id} className="border-b pb-2" data-testid={`log-${log.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.details}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No activity logs found</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updates: any = {};
                  
                  const plan = formData.get('plan');
                  const isAdmin = formData.get('isAdmin');
                  const name = formData.get('name');
                  
                  if (plan) updates.plan = plan;
                  if (isAdmin !== null) updates.isAdmin = isAdmin === 'true';
                  if (name) updates.name = name;
                  
                  updateUserMutation.mutate({
                    userId: selectedUser.id,
                    updates,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Email</Label>
                  <Input value={selectedUser.email} disabled />
                </div>
                <div>
                  <Label htmlFor="edit-user-name">Name</Label>
                  <Input
                    id="edit-user-name"
                    name="name"
                    defaultValue={selectedUser.name || ''}
                    data-testid="input-edit-user-name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-user-plan">Plan</Label>
                  <Select name="plan" defaultValue={selectedUser.plan}>
                    <SelectTrigger id="edit-user-plan" data-testid="select-edit-user-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="AUTHORITY">Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-user-admin">Admin Status</Label>
                  <Select name="isAdmin" defaultValue={selectedUser.isAdmin ? 'true' : 'false'}>
                    <SelectTrigger id="edit-user-admin" data-testid="select-edit-user-admin">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Regular User</SelectItem>
                      <SelectItem value="true">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditUserDialogOpen(false)}
                    data-testid="button-cancel-edit-user"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateUserMutation.isPending}
                    data-testid="button-save-user"
                  >
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Ticket Dialog */}
        <Dialog open={editTicketDialogOpen} onOpenChange={setEditTicketDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Support Ticket</DialogTitle>
              <DialogDescription>
                Update ticket status, priority, and assignment.
              </DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updates: any = {};
                  
                  const status = formData.get('status');
                  const priority = formData.get('priority');
                  const assignedTo = formData.get('assignedTo');
                  
                  if (status) updates.status = status;
                  if (priority) updates.priority = priority;
                  if (assignedTo) updates.assignedTo = assignedTo || null;
                  
                  updateTicketMutation.mutate({
                    ticketId: selectedTicket.id,
                    updates,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Subject</Label>
                  <Input value={selectedTicket.subject} disabled />
                </div>
                <div>
                  <Label htmlFor="edit-ticket-status">Status</Label>
                  <Select name="status" defaultValue={selectedTicket.status}>
                    <SelectTrigger id="edit-ticket-status" data-testid="select-edit-ticket-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-ticket-priority">Priority</Label>
                  <Select name="priority" defaultValue={selectedTicket.priority}>
                    <SelectTrigger id="edit-ticket-priority" data-testid="select-edit-ticket-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditTicketDialogOpen(false)}
                    data-testid="button-cancel-edit-ticket"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateTicketMutation.isPending}
                    data-testid="button-save-ticket"
                  >
                    {updateTicketMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
