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

  const handleGuest = () => {
    document.cookie = `guest=1; path=/`;
    router.push(redirectTo);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    signInWithEmailAndPassword(auth, email, password)
      .then(() => router.push(redirectTo))
      .catch((err) => toast.error(err.message));
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => router.push(redirectTo))
      .catch((err) => toast.error(err.message));
  };

  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => router.push(redirectTo))
      .catch((err) => toast.error(err.message));
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
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required />
                          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(v => !v)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button className="w-full btn-premium" type="submit">Sign In</Button>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex-1 h-px bg-white/10" /> Or continue with <span className="flex-1 h-px bg-white/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="glass-effect w-full" type="button" onClick={handleGoogle}>
                          <Mail className="h-4 w-4 mr-2" /> Google
                        </Button>
                        <Button variant="outline" className="glass-effect w-full" type="button">
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
                          <Input id="first" name="first" type="text" placeholder="Jane" required />
                        </div>
                        <div>
                          <Label htmlFor="last">Last name</Label>
                          <Input id="last" name="last" type="text" placeholder="Doe" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email2">Email</Label>
                        <Input id="email2" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <Label htmlFor="password2">Password</Label>
                        <Input id="password2" name="password" type="password" placeholder="Create a password" required />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input type="checkbox" id="terms" required className="accent-primary" />
                        <label htmlFor="terms">I agree to the <span className="underline underline-offset-4">Terms & Conditions</span></label>
                      </div>
                      <Button className="w-full btn-premium" type="submit">Create account</Button>
                    </form>
                  </TabsContent>

                  {/* Guest */}
                  <TabsContent value="guest" className="mt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Explore FitLife without an account. You can upgrade to a full account anytime.
                      </p>
                      <Button className="w-full glass-effect" onClick={handleGuest}>Continue as Guest</Button>
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


