import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Check, Star } from "lucide-react";

export default function PricingPage() {
  const plans = [
    { 
      name: "Starter", 
      price: "$29", 
      period: "/month", 
      popular: false,
      description: "Perfect for beginners",
      features: [
        "Access to gym floor",
        "Basic equipment",
        "Locker room access",
        "Free parking",
      ],
      facilities: [
        "Cardio zone",
        "Free weights area",
        "Locker room",
        "Parking",
      ],
    },
    { 
      name: "Premium", 
      price: "$59", 
      period: "/month", 
      popular: true,
      description: "Most popular choice",
      features: [
        "All Starter features",
        "Group classes",
        "Personal trainer sessions",
        "Spa access",
        "Nutrition consultation",
      ],
      facilities: [
        "All Starter facilities",
        "Group studio access",
        "Sauna",
        "Nutrition lounge",
      ],
    },
    { 
      name: "Elite", 
      price: "$99", 
      period: "/month", 
      popular: false,
      description: "Ultimate fitness experience",
      features: [
        "All Premium features",
        "Private training",
        "Spa treatments",
        "Guest passes",
        "Priority booking",
      ],
      facilities: [
        "All Premium facilities",
        "Private studio",
        "Spa & recovery zone",
        "VIP lounge",
      ],
    },
  ] as const;

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Pricing</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Choose a plan that fits your goals. You can upgrade or cancel anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative card-gradient premium-shadow hover-lift ${plan.popular ? 'ring-2 ring-primary shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground px-5 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-pulse-glow relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      <span className="relative z-10 inline-flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" /> Most Popular
                      </span>
                    </div>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gradient-primary">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gradient-secondary">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="font-semibold mb-3 text-gradient-primary">Features</div>
                      <ul className="space-y-2">
                        {plan.features.map((item) => (
                          <li key={item} className="flex items-center text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary mr-2" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold mb-3 text-gradient-primary">Facilities</div>
                      <ul className="space-y-2">
                        {plan.facilities.map((item) => (
                          <li key={item} className="flex items-center text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary mr-2" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className={plan.popular ? "btn-premium w-full mt-6" : "glass-effect w-full mt-6"} asChild>
                    <Link href={{ pathname: "/login", query: { redirect: `/join?plan=${plan.name.toLowerCase()}` } }}>Choose {plan.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


