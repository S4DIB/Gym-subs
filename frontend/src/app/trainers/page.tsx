import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Heart, Users, Award, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TrainersPage() {
  const trainers = [
    {
      name: "Alex Carter",
      role: "Head Coach · Strength",
      initials: "AC",
      bio: "10+ years coaching athletes and beginners with a focus on safe, sustainable progress.",
      specialties: ["Strength", "Powerlifting", "Mobility"],
      rating: 4.9,
      sessions: 1200,
    },
    {
      name: "Mia Nguyen",
      role: "Yoga & Mobility",
      initials: "MN",
      bio: "Certified yoga instructor blending Vinyasa and restorative flows for all levels.",
      specialties: ["Yoga", "Mobility", "Mindfulness"],
      rating: 4.8,
      sessions: 980,
    },
    {
      name: "Diego Santos",
      role: "HIIT & Conditioning",
      initials: "DS",
      bio: "High-energy conditioning classes focused on endurance, agility, and fun.",
      specialties: ["HIIT", "Endurance", "Bootcamp"],
      rating: 4.9,
      sessions: 1100,
    },
    {
      name: "Sofia Rossi",
      role: "Pilates & Core",
      initials: "SR",
      bio: "Low-impact core strengthening to improve posture, stability, and balance.",
      specialties: ["Pilates", "Core", "Posture"],
      rating: 4.7,
      sessions: 840,
    },
    {
      name: "Marcus Lee",
      role: "Personal Training",
      initials: "ML",
      bio: "Tailored 1:1 programs for strength, fat loss, and lifestyle transformation.",
      specialties: ["1:1 Coaching", "Strength", "Nutrition"],
      rating: 4.9,
      sessions: 1500,
    },
    {
      name: "Hana Kim",
      role: "Spin & Cardio",
      initials: "HK",
      bio: "Rhythm-based rides with interval work to build stamina and power.",
      specialties: ["Spin", "Cardio", "Intervals"],
      rating: 4.8,
      sessions: 910,
    },
  ];

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">Trainers</h1>
            <p className="text-muted-foreground text-lg">
              Meet our certified coaches. Book a session and start your personalized program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {trainers.map((t) => (
              <Card key={t.name} className="card-gradient premium-shadow hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl text-gradient-primary">{t.name}</CardTitle>
                        <CardDescription>{t.role}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="glass-effect inline-flex items-center gap-1">
                      <Star className="h-3 w-3" /> {t.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{t.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {t.specialties.map((s) => (
                      <Badge key={s} variant="outline" className="glass-effect">{s}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Sessions:</span> {t.sessions.toLocaleString()}
                  </div>
                  <Button className="w-full btn-premium">Book Session</Button>
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


