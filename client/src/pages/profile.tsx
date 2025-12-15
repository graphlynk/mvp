import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Profile, User, insertProfileSchema, type InsertProfile, type Link as ProfileLink } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, GripVertical, Eye, ArrowLeft, Link2, Upload } from "lucide-react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SimpleFileUpload } from "@/components/SimpleFileUpload";

// Extended schema for profile form with links
const profileFormSchema = insertProfileSchema.extend({
  avatarUrl: z.string().url("Valid URL required").or(z.literal("")).optional(),
  links: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      url: z.string().url("Valid URL is required"),
      order: z.number().optional(),
    })
  ).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileWithLinks = Profile & { links?: ProfileLink[] };

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data: profile, isLoading } = useQuery<ProfileWithLinks>({
    queryKey: ["/api/profile"],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: "",
      username: "",
      title: "",
      bio: "",
      avatarUrl: "",
      showKgMetrics: false,
      links: [],
    },
  });

  // Initialize form when profile data loads
  useEffect(() => {
    if (profile && user) {
      form.reset({
        userId: user.id,
        username: profile.username,
        title: profile.title || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
        showKgMetrics: profile.showKgMetrics,
        links: profile.links || [],
      });
    } else if (user && !profile) {
      form.setValue("userId", user.id);
    }
  }, [profile, user, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return apiRequest("POST", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile Saved!",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const links = form.watch("links") || [];

  const addLink = () => {
    const currentLinks = form.getValues("links") || [];
    form.setValue("links", [...currentLinks, { label: "", url: "", order: currentLinks.length }]);
  };

  const removeLink = (index: number) => {
    const currentLinks = form.getValues("links") || [];
    form.setValue("links", currentLinks.filter((_, i) => i !== index));
  };

  const onSubmit = (values: ProfileFormValues) => {
    // Reorder links based on their array position
    const orderedLinks = values.links?.map((link, index) => ({ ...link, order: index }));
    saveMutation.mutate({ ...values, links: orderedLinks });
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
              <h1 className="text-2xl font-bold" data-testid="text-profile-title">My Profile</h1>
              <p className="text-sm text-muted-foreground">Create your SEO-optimized link page</p>
            </div>
          </div>
          {profile?.username && (
            <Link href={`/u/${profile.username}`} target="_blank">
              <Button variant="outline" size="sm" data-testid="button-view-public">
                <Eye className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <Card data-testid="card-basic-info">
              <CardHeader>
                <CardTitle className="text-2xl leading-none tracking-tight font-bold">Basic Information</CardTitle>
                <CardDescription>
                  Set up your profile username and display information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-3 bg-muted border border-r-0 rounded-l-lg text-muted-foreground text-sm">
                            /u/
                          </span>
                          <Input
                            placeholder="your-username"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                            className="rounded-l-none"
                            data-testid="input-username"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your profile will be at: /u/{field.value || "your-username"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name / Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name or Company"
                          {...field}
                          value={field.value ?? ""}
                          data-testid="input-title"
                        />
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
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Tell visitors about yourself... You can use HTML and inline CSS for custom styling!"
                          maxLength={2000}
                          rows={8}
                          showImageUpload={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                            <Input
                              type="url"
                              placeholder="https://example.com/avatar.jpg or upload below"
                              {...field}
                              value={field.value ?? ""}
                              data-testid="input-avatar"
                            />
                          <SimpleFileUpload
                            onUploadComplete={(objectPath) => {
                              form.setValue("avatarUrl", objectPath);
                              queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
                            }}
                            accept="image/*"
                            maxSizeMB={5}
                            buttonText="Upload Photo"
                            className="shrink-0"
                            finalizeEndpoint="/api/profile/avatar"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a photo or paste an image URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Links */}
            <Card data-testid="card-links">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>
                      Add links to your social profiles, website, and more
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addLink} size="sm" data-testid="button-add-link">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No links yet. Click "Add Link" to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.map((_, index) => (
                      <div key={index} className="flex gap-3 items-start" data-testid={`link-item-${index}`}>
                        <div className="pt-3 cursor-grab">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`links.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                    <Input
                                      placeholder="Label (e.g., Website)"
                                      {...field}
                                      value={field.value ?? ""}
                                      data-testid={`input-link-label-${index}`}
                                    />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`links.${index}.url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                    <Input
                                      placeholder="URL (e.g., https://...)"
                                      {...field}
                                      value={field.value ?? ""}
                                      data-testid={`input-link-url-${index}`}
                                    />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(index)}
                          className="mt-0.5"
                          data-testid={`button-remove-link-${index}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-3 justify-end">
              <Link href="/dashboard">
                <Button type="button" variant="outline" data-testid="button-cancel">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save-profile"
              >
                {saveMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
