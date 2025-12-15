import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { requestCodeSchema, verifyCodeSchema, type RequestCode, type VerifyCode } from "@shared/schema";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [stage, setStage] = useState<"request" | "verify">("request");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestForm = useForm<RequestCode>({
    resolver: zodResolver(requestCodeSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyForm = useForm<VerifyCode>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  async function handleRequestCode(values: RequestCode) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send code");
      }

      toast({
        title: "Code Sent!",
        description: "Check your email for your 6-digit login code",
      });
      setSubmittedEmail(values.email);
      verifyForm.setValue("email", values.email);
      setStage("verify");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(values: VerifyCode) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid code");
      }

      toast({
        title: "Success!",
        description: "Logging you in...",
      });

      setTimeout(() => setLocation("/dashboard"), 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDemoLogin() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Demo login failed");
      }

      toast({
        title: "Welcome!",
        description: "Logged in as demo user with PRO features",
      });

      setTimeout(() => setLocation("/dashboard"), 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Demo login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-12 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-login-title">Welcome Back</h1>
          <p className="text-muted-foreground" data-testid="text-login-subtitle">
            Sign in with your email - no password required
          </p>
        </div>

        {stage === "request" ? (
          <Card data-testid="card-request-code">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                We'll send you a secure 6-digit code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(handleRequestCode)} className="space-y-6">
                  <FormField
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            disabled={isLoading}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-send-code"
                  >
                    {isLoading ? "Sending..." : "Send Login Code"}
                    <Mail className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  data-testid="button-demo-login"
                >
                  {isLoading ? "Logging in..." : "Try Demo Account"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Instant access with PRO features - no email required
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card data-testid="card-verify-code">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-center">Enter Code</CardTitle>
              <CardDescription className="text-center">
                Check your email at <strong>{submittedEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...verifyForm}>
                <form onSubmit={verifyForm.handleSubmit(handleVerifyCode)} className="space-y-6">
                  <FormField
                    control={verifyForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6-Digit Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="123456"
                            disabled={isLoading}
                            className="text-center text-2xl tracking-widest font-mono"
                            data-testid="input-code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-verify-code"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStage("request");
                      verifyForm.reset();
                    }}
                    disabled={isLoading}
                    data-testid="button-back-to-email"
                  >
                    Use Different Email
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
