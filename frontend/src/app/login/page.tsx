"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Apple, Mail } from "lucide-react";
import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuest = () => {
    document.cookie = `guest=1; path=/`;
    router.push(redirectTo);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      
      if (!auth) {
        throw new Error("Authentication service not available");
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      router.push(redirectTo === "/" ? "/dashboard" : redirectTo);
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Sign in failed";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      
      if (!auth) {
        throw new Error("Authentication service not available");
      }
      
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Welcome to FitLife!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "Sign up failed";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (!auth) {
        throw new Error("Authentication service not available");
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        toast.success("Welcome to FitLife!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
        return;
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Pop-up blocked. Please allow pop-ups for this site");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Request was cancelled, don't show error
        return;
      } else {
        toast.error("Google sign-in failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center">
          {/* Auth Panel */}
          <Card className="card-gradient premium-shadow w-full">
              <CardHeader>
                <CardTitle className="text-3xl">Create an account</CardTitle>
                <CardDescription>
                  Already have an account? <Link href="#" className="underline underline-offset-4">Log in</Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="guest">Guest</TabsTrigger>
                  </TabsList>

                  {/* Sign In */}
                  <TabsContent value="signin" className="mt-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isLoading} />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required disabled={isLoading} />
                          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(v => !v)} disabled={isLoading}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button className="w-full btn-premium" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex-1 h-px bg-white/10" /> Or continue with <span className="flex-1 h-px bg-white/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="glass-effect w-full" type="button" onClick={handleGoogle} disabled={isLoading}>
                          <Mail className="h-4 w-4 mr-2" /> Google
                        </Button>
                        <Button variant="outline" className="glass-effect w-full" type="button" disabled={isLoading}>
                          <Apple className="h-4 w-4 mr-2" /> Apple
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Sign Up */}
                  <TabsContent value="signup" className="mt-6">
                    <form className="space-y-4" onSubmit={handleSignup}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first">First name</Label>
                          <Input id="first" name="first" type="text" placeholder="Jane" required disabled={isLoading} />
                        </div>
                        <div>
                          <Label htmlFor="last">Last name</Label>
                          <Input id="last" name="last" type="text" placeholder="Doe" required disabled={isLoading} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email2">Email</Label>
                        <Input id="email2" name="email" type="email" placeholder="you@example.com" required disabled={isLoading} />
                      </div>
                      <div>
                        <Label htmlFor="password2">Password</Label>
                        <Input id="password2" name="password" type="password" placeholder="Create a password" required disabled={isLoading} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input type="checkbox" id="terms" required className="accent-primary" disabled={isLoading} />
                        <label htmlFor="terms">I agree to the <span className="underline underline-offset-4">Terms & Conditions</span></label>
                      </div>
                      <Button className="w-full btn-premium" type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create account"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Guest */}
                  <TabsContent value="guest" className="mt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Explore FitLife without an account. You can upgrade to a full account anytime.
                      </p>
                      <Button className="w-full glass-effect" onClick={handleGuest} disabled={isLoading}>
                        Continue as Guest
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


