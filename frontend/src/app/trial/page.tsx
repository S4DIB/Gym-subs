import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrialPage() {
  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Start Your Free Trial</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Enjoy full access for 7 days. No charges today—cancel anytime during the trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="btn-premium" asChild>
              <Link href={{ pathname: "/login", query: { redirect: "/join?plan=premium&trial=true" } }}>Start Trial on Premium</Link>
            </Button>
            <Button variant="outline" className="glass-effect" asChild>
              <Link href="/pricing">See All Plans</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


