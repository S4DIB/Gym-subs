"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function JoinPage() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const isTrial = params.get("trial") === "true";

  const normalizedPlan = useMemo(() => {
    const valid = ["starter", "premium", "elite"] as const;
    const selected = plan?.toLowerCase();
    return valid.includes(selected as any) ? selected : undefined;
  }, [plan]);

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">{isTrial ? 'Start Free Trial' : 'Join FitLife'}</h1>
          <p className="text-muted-foreground text-lg mb-6">
            {normalizedPlan
              ? isTrial
                ? `You're starting a free trial on the ${normalizedPlan[0].toUpperCase()}${normalizedPlan.slice(1)} plan.`
                : `You're selecting the ${normalizedPlan[0].toUpperCase()}${normalizedPlan.slice(1)} plan.`
              : isTrial
                ? "Choose a plan to start your trial."
                : "Choose a plan to continue."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { key: "starter", label: "Starter" },
              { key: "premium", label: "Premium" },
              { key: "elite", label: "Elite" },
            ].map((p) => (
              <Button key={p.key} className={p.key === normalizedPlan ? "btn-premium" : "glass-effect"} asChild>
                <a href={`/join?plan=${p.key}${isTrial ? '&trial=true' : ''}`}>{p.label}</a>
              </Button>
            ))}
          </div>
          <Button className="btn-premium w-full sm:w-auto">Continue</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}


