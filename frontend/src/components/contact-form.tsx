"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle
} from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interest: "general"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("🎉 Thank you! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        interest: "general",
      });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      value: "info@fitlife.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      value: "(555) 123-4567",
      description: "Available 24/7 for emergencies"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      value: "123 Fitness Street, Gym City",
      description: "Come see our facilities"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      value: "24/7 Access",
      description: "Members can access anytime"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 glass-effect">
            <Send className="h-3 w-3 mr-1" />
            Get In Touch
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-gradient-primary">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg card-gradient premium-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient-primary">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 glass-effect"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 glass-effect"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 glass-effect"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                      I'm Interested In
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 glass-effect"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="membership">Membership</option>
                      <option value="training">Personal Training</option>
                      <option value="classes">Group Classes</option>
                      <option value="tours">Facility Tour</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none glass-effect"
                    placeholder="Tell us about your fitness goals and how we can help..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg font-semibold hover:scale-105 transition-all duration-200 btn-premium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gradient-primary mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground text-lg">
                We're here to help you achieve your fitness goals. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 card-gradient premium-shadow hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0 animate-float">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gradient-primary">{info.title}</h4>
                        <p className="text-foreground font-medium">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="border-0 bg-gradient-to-r from-primary/20 to-secondary/20 premium-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="font-semibold text-gradient-primary">Free Consultation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Book a free consultation with our fitness experts to discuss your goals and create a personalized plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 