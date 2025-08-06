"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Trophy, 
  Clock, 
  Star,
  TrendingUp,
  Award
} from "lucide-react";
import { useState, useEffect } from "react";

export default function StatsSection() {
  const [counts, setCounts] = useState({
    members: 0,
    trainers: 0,
    classes: 0,
    rating: 0
  });

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: counts.members,
      label: "Active Members",
      suffix: "+",
      color: "text-blue-400"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      value: counts.trainers,
      label: "Expert Trainers",
      suffix: "",
      color: "text-yellow-400"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      value: counts.classes,
      label: "Weekly Classes",
      suffix: "+",
      color: "text-green-400"
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: counts.rating,
      label: "Member Rating",
      suffix: "/5",
      color: "text-purple-400"
    }
  ];

  useEffect(() => {
    const targetCounts = {
      members: 5000,
      trainers: 50,
      classes: 200,
      rating: 4.9
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        members: Math.floor(targetCounts.members * progress),
        trainers: Math.floor(targetCounts.trainers * progress),
        classes: Math.floor(targetCounts.classes * progress),
        rating: Number((targetCounts.rating * progress).toFixed(1))
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 glass-effect">
            <TrendingUp className="h-3 w-3 mr-1" />
            Growing Stronger Every Day
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-gradient-primary">
            FitLife by the Numbers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community of fitness enthusiasts who have already achieved their goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 card-gradient premium-shadow hover-lift">
              <CardContent className="pt-8 pb-6">
                <div className={`mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 ${stat.color} animate-float`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gradient-secondary mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm glass-effect">
              <Award className="h-4 w-4 mr-2" />
              Best Gym 2024
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm glass-effect">
              <Star className="h-4 w-4 mr-2" />
              4.9/5 Rating
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm glass-effect">
              <Users className="h-4 w-4 mr-2" />
              5000+ Members
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm glass-effect">
              <Trophy className="h-4 w-4 mr-2" />
              Award Winning
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
} 