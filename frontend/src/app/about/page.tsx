import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Dumbbell, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">About FitLife</h1>
            <p className="text-muted-foreground text-lg">
              FitLife is a modern fitness club dedicated to helping people build sustainable, healthy lifestyles. 
              We combine expert coaching, welcoming community, and thoughtfully designed facilities to create a premium experience for all levels.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gradient-primary mb-2">Our Mission</h2>
                <p className="text-muted-foreground">
                  Empower every member to move better, get stronger, and live well—through science-backed training,
                  personalized guidance, and a supportive environment that celebrates progress over perfection.
                </p>
              </CardContent>
            </Card>
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gradient-primary mb-2">Our Vision</h2>
                <p className="text-muted-foreground">
                  Build the most trusted fitness community where results are measured in confidence, longevity,
                  and the joy of consistent movement.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What Sets Us Apart */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gradient-primary mb-4">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 
                { icon: <Dumbbell className="h-5 w-5" />, title: "Expert Coaching", text: "Certified trainers who craft programs tailored to your goals." },
                { icon: <Shield className="h-5 w-5" />, title: "Member Safety", text: "Clean, safe facilities with smart equipment and best practices." },
                { icon: <Users className="h-5 w-5" />, title: "Community", text: "Supportive culture that keeps you consistent and accountable." },
                { icon: <Heart className="h-5 w-5" />, title: "Whole‑Person Approach", text: "Training, recovery, and habits that fit real life." },
              ].map((f) => (
                <Card key={f.title} className="card-gradient premium-shadow hover-lift">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-primary mb-3">
                      {f.icon}
                    </div>
                    <div className="font-semibold mb-1">{f.title}</div>
                    <div className="text-sm text-muted-foreground">{f.text}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Credibility */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient-secondary mb-1">5,000+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </CardContent>
            </Card>
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient-secondary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Expert Trainers</div>
              </CardContent>
            </Card>
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center items-center gap-2 text-gradient-secondary text-lg font-semibold mb-1">
                  <Award className="h-5 w-5" /> Best Gym 2024
                </div>
                <div className="text-sm text-muted-foreground">Community‑voted excellence</div>
              </CardContent>
            </Card>
          </div>

          {/* Callout */}
          <div className="text-center">
            <Badge variant="secondary" className="glass-effect">We’re here for your long‑term success</Badge>
            <p className="mt-3 text-muted-foreground">
              Whether you’re just getting started or leveling up, our team will meet you where you are and help you move forward—one
              great session at a time.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


