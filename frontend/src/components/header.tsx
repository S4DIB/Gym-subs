"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Menu, X, User, Phone, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.email ? ["shahsadib25@gmail.com", "admin@fitlife.com"].includes(user.email) : false;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Trainers", href: "/trainers" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-glow">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary">FitLife</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-gradient-primary transition-all duration-200 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="glass-effect hover:bg-white/10" asChild>
              <Link href="/contact">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Link>
            </Button>
            {user ? (
              <>
                {/* Debug: Show user email and admin status */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-yellow-400 mr-2">
                    {user.email} | Admin: {isAdmin ? 'YES' : 'NO'}
                  </div>
                )}
                {isAdmin && (
                  <Button variant="ghost" size="sm" className="glass-effect text-red-400 border-red-400/20" asChild>
                    <Link href="/admin">
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="glass-effect" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="glass-effect" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" className="btn-premium" asChild>
                <Link href={{ pathname: "/login", query: { redirect: "/join" } }}>
                  <User className="h-4 w-4 mr-2" />
                  Join Now
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-effect"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-effect border-t border-white/10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-gradient-primary hover:bg-white/10 rounded-md transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start glass-effect" asChild>
                  <Link href="/contact">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Link>
                </Button>
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="w-full justify-start glass-effect text-red-400" asChild>
                        <Link href="/admin">
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full justify-start glass-effect" asChild>
                      <Link href="/dashboard">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start glass-effect" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button className="w-full justify-start btn-premium" asChild>
                    <Link href={{ pathname: "/login", query: { redirect: "/join" } }}>
                      <User className="h-4 w-4 mr-2" />
                      Join Now
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 