"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, CreditCard, Loader2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/AuthContext";
import { stripePromise } from "@/lib/stripe/client";
import { toast } from "sonner";
import Link from "next/link";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    icon: Zap,
    color: "text-blue-500",
    popular: false,
    features: [
      "Access to gym equipment",
      "Locker room access", 
      "Basic fitness assessment",
      "Mobile app access"
    ]
  },
  {
    id: "standard", 
    name: "Standard",
    price: 49,
    icon: Star,
    color: "text-purple-500",
    popular: true,
    features: [
      "Everything in Basic",
      "Group fitness classes",
      "Personal training session (1/month)",
      "Nutrition consultation",
      "Guest passes (2/month)"
    ]
  },
  {
    id: "premium",
    name: "Premium", 
    price: 79,
    icon: Crown,
    color: "text-yellow-500",
    popular: false,
    features: [
      "Everything in Standard",
      "Unlimited personal training", 
      "Premium classes access",
      "Massage therapy (1/month)",
      "Meal planning service",
      "Priority booking"
    ]
  }
];

export default function JoinPage() {
  const { user } = useAuth();
  const params = useSearchParams();
  const planParam = params.get("plan");
  const isTrial = params.get("trial") === "true";
  const [selectedPlan, setSelectedPlan] = useState(planParam || "standard");
  const [loading, setLoading] = useState(false);

  const plan = useMemo(() => {
    return plans.find(p => p.id === selectedPlan) || plans[1];
  }, [selectedPlan]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: selectedPlan,
          userId: user.uid,
          trial: isTrial
        }),
      });

      const { sessionId, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen premium-gradient">
        <Header />
        <main className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">Join FitLife</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Please log in to continue with your subscription.
            </p>
            <Button className="btn-premium" asChild>
              <Link href="/login?redirect=/join">Log In to Continue</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">
              {isTrial ? "Start Your Free Trial" : "Choose Your Plan"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isTrial 
                ? "7-day free trial, then billed monthly. Cancel anytime."
                : "Start your fitness journey today with our flexible plans."
              }
            </p>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {plans.map((planOption) => {
              const Icon = planOption.icon;
              const isSelected = selectedPlan === planOption.id;
              
              return (
                <Card 
                  key={planOption.id}
                  className={`card-gradient premium-shadow cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPlan(planOption.id)}
                >
                  <CardHeader className="text-center">
                    {planOption.popular && (
                      <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500">
                        Most Popular
                      </Badge>
                    )}
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${planOption.color}`} />
                    <CardTitle className="text-gradient-primary">{planOption.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">${planOption.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {planOption.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Plan Summary */}
          <Card className="card-gradient premium-shadow max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-gradient-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{plan.name} Plan</span>
                <span className="text-2xl font-bold">${plan.price}/month</span>
              </div>
              
              {isTrial && (
                <div className="flex justify-between items-center text-green-600">
                  <span>7-day free trial</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{isTrial ? "Today's Total" : "Monthly Total"}</span>
                  <span>${isTrial ? "0.00" : plan.price}</span>
                </div>
                {isTrial && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll be charged ${plan.price}/month after your 7-day trial ends.
                  </p>
                )}
              </div>

              <Button 
                className="w-full btn-premium" 
                size="lg"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isTrial ? "Start Free Trial" : "Subscribe Now"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe. Cancel anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}