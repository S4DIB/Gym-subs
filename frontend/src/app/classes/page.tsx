import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Heart, Clock, Users, Zap, Star, Calendar } from "lucide-react";

export default function ClassesPage() {
  const classes = [
    {
      icon: <Zap className="h-6 w-6" />,
      name: "HIIT Blast",
      description: "High-intensity intervals to boost endurance and burn calories.",
      duration: "45 min",
      intensity: "High",
      capacity: 20,
      days: "Mon · Wed · Fri",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      name: "Yoga Flow",
      description: "Improve flexibility, balance, and breathing with guided flows.",
      duration: "60 min",
      intensity: "Low",
      capacity: 25,
      days: "Tue · Thu · Sat",
    },
    {
      icon: <Dumbbell className="h-6 w-6" />,
      name: "Strength 101",
      description: "Technique-focused strength training for all levels.",
      duration: "50 min",
      intensity: "Medium",
      capacity: 18,
      days: "Mon · Thu",
    },
    {
      icon: <Users className="h-6 w-6" />,
      name: "Bootcamp",
      description: "Full-body functional circuits with team motivation.",
      duration: "55 min",
      intensity: "High",
      capacity: 22,
      days: "Wed · Sat",
    },
    {
      icon: <Star className="h-6 w-6" />,
      name: "Pilates Core",
      description: "Low-impact core strengthening and posture work.",
      duration: "50 min",
      intensity: "Low",
      capacity: 16,
      days: "Tue · Fri",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      name: "Spin Express",
      description: "Cardio-focused ride with sprints and climbs.",
      duration: "30 min",
      intensity: "Medium",
      capacity: 20,
      days: "Daily",
    },
  ];

  const schedule = [
    { day: "Monday", items: ["6:30 AM — HIIT Blast", "5:00 PM — Strength 101"] },
    { day: "Tuesday", items: ["7:00 AM — Yoga Flow", "6:00 PM — Pilates Core"] },
    { day: "Wednesday", items: ["6:30 AM — Bootcamp", "5:30 PM — HIIT Blast"] },
    { day: "Thursday", items: ["7:00 AM — Strength 101", "6:00 PM — Yoga Flow"] },
    { day: "Friday", items: ["6:30 AM — HIIT Blast", "5:30 PM — Pilates Core"] },
    { day: "Saturday", items: ["9:00 AM — Bootcamp", "10:00 AM — Yoga Flow"] },
  ];

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">Classes</h1>
            <p className="text-muted-foreground text-lg">
              Explore our most popular classes. Timetables and availability are updated weekly.
            </p>
          </div>

          {/* Class Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {classes.map((c) => (
              <Card key={c.name} className="card-gradient premium-shadow hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-primary">
                        {c.icon}
                      </div>
                      <CardTitle className="text-xl text-gradient-primary">{c.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="glass-effect">{c.intensity}</Badge>
                  </div>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {c.duration}</span>
                    <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {c.capacity} spots</span>
                    <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {c.days}</span>
                  </div>
                  <Button className="w-full btn-premium" asChild>
                    <a href="/join?plan=premium">Join Class</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Schedule (dummy) */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gradient-primary mb-4">Weekly Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedule.map((day) => (
                <Card key={day.day} className="card-gradient premium-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{day.day}</CardTitle>
                    <CardDescription>Sample times — subject to change</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {day.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" /> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


