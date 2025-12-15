import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Post, User, insertPostSchema, type InsertPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function Blog() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/blog/posts"],
  });

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      userId: user?.id || "",
      title: "",
      slug: "",
      html: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      return apiRequest("POST", "/api/blog/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({
        title: "Post Created!",
        description: "Your blog post has been published",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
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
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Pro to unlock blog publishing and newsletter features
            </p>
            <Button>Upgrade to Pro</Button>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = (values: InsertPost) => {
    createMutation.mutate({
      ...values,
      userId: user!.id,
      slug: values.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    });
  };

  const autoGenerateSlug = () => {
    const title = form.getValues("title");
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    form.setValue("slug", generated);
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
              <h1 className="text-2xl font-bold" data-testid="text-blog-title">Blog Posts</h1>
              <p className="text-sm text-muted-foreground">Publish SEO-optimized content</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-post">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Write and publish SEO-friendly blog content
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Post Title"
                            {...field}
                            data-testid="input-post-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="your-post-slug"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                              data-testid="input-post-slug"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={autoGenerateSlug}
                            disabled={!form.watch("title")}
                            data-testid="button-generate-slug"
                          >
                            Auto
                          </Button>
                        </div>
                        <FormDescription>
                          URL: /blog/{field.value || "your-post-slug"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="html"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Write your blog post content here... Use HTML for formatting and add images!"
                            rows={15}
                            showImageUpload={true}
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
                      data-testid="button-cancel-post"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      data-testid="button-publish-post"
                    >
                      {createMutation.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="posts-grid">
            {posts.map((post) => (
              <Card key={post.id} className="hover-elevate" data-testid={`post-${post.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <Button variant="ghost" size="icon" data-testid={`button-edit-${post.id}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-view-${post.id}`}>
                      View Post
                    </Button>
                    <Button variant="ghost" size="sm" data-testid={`button-share-${post.id}`}>
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card data-testid="card-empty-posts">
            <CardContent className="p-12 text-center text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Posts Yet</h3>
              <p className="mb-6 max-w-md mx-auto">
                Start creating SEO-optimized blog content to engage your audience and boost your rankings.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-post">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
