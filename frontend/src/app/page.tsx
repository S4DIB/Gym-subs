"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { 
  Dumbbell, 
  Users, 
  Clock, 
  Star, 
  Check, 
  ArrowRight, 
  Play,
  Zap,
  Shield,
  Heart,
  Target,
  Award
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StatsSection from "@/components/stats-section";
import ContactForm from "@/components/contact-form";

export default function Home() {

  const features = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Premium Equipment",
      description: "State-of-the-art fitness equipment from leading brands"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Trainers",
      description: "Certified personal trainers and fitness coaches"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Access",
      description: "Round-the-clock access to all facilities"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health Monitoring",
      description: "Advanced health tracking and progress monitoring"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
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
      popular: false,
    },
    {
      name: "Premium",
      price: "$59",
      period: "/month",
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
      popular: true,
    },
    {
      name: "Elite",
      price: "$99",
      period: "/month",
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
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "FitLife transformed my fitness journey. The trainers are amazing and the facilities are top-notch!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "The 24/7 access is perfect for my busy schedule. Best investment I've made for my health.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      role: "Yoga Instructor",
      content: "The variety of classes and equipment is incredible. I've never felt more motivated to work out!",
      rating: 5,
      avatar: "ED"
    }
  ];

  return (
    <div className="min-h-screen premium-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 hero-gradient">
        {/* Background image (add public/hero-gym.jpg) */}
        <div className="absolute inset-0">
          <Image
            src="/hero-gym.png"
            alt="Members training at FitLife gym"
            fill
            priority
            className="object-cover object-[center_35%] opacity-30"
            aria-hidden
          />
        </div>
        {/* Top fade to keep header readable and hide top of image */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in glass-effect">
              <Zap className="h-3 w-3 mr-1" />
              Premium Fitness Experience
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in">
              Transform Your
              <span className="text-gradient-primary"> Fitness</span>
              <br />
              Journey Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
              Join thousands of members who have achieved their fitness goals with our state-of-the-art facilities, 
              expert trainers, and personalized programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-all duration-200 btn-premium premium-shadow-lg"
                asChild
              >
                <Link href={{ pathname: "/login", query: { redirect: "/join" } }}>
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-all duration-200 glass-effect"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/50 to-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-gradient-primary">
              Why Choose FitLife?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium facilities and expert guidance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 card-gradient premium-shadow hover-lift">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground mb-4 animate-float">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gradient-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-gradient-primary">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible plans designed to fit your lifestyle and fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105 premium-shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10' : 'premium-shadow'} hover:shadow-lg transition-all duration-300 card-gradient`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse-glow relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      <span className="relative z-10 flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Most Popular
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
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <div className="font-semibold mb-2 text-gradient-primary">Features</div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold mb-2 text-gradient-primary">Facilities</div>
                      <ul className="space-y-2">
                        {plan.facilities?.map((facility, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'btn-premium' : 'glass-effect'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={{ pathname: "/login", query: { redirect: `/join?plan=${plan.name.toLowerCase()}` } }}>
                      Choose {plan.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-gradient-primary">
              What Our Members Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people who transformed their lives with FitLife
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 card-gradient premium-shadow hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gradient-primary">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of members who have already transformed their lives with FitLife
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-all duration-200 btn-premium"
            asChild
          >
            <Link href="/trial">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      <Footer />
    </div>
  );
}
