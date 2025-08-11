"use client";

import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, UserCheck, BarChart3, Settings, Home, Shield, Dumbbell } from "lucide-react";
import Link from "next/link";

const adminNavigation = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Trainers", href: "/admin/trainers", icon: UserCheck },
  { name: "Classes", href: "/admin/classes", icon: Calendar },
  { name: "Equipment", href: "/admin/equipment", icon: Dumbbell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <Card className="card-gradient premium-shadow max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-6">
              You don't have admin permissions to access this area.
            </p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-gradient">
      {/* Admin Header */}
      <div className="border-b border-border/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="bg-red-600">
                <Shield className="h-3 w-3 mr-1" />
                ADMIN
              </Badge>
              <h1 className="text-xl font-bold text-gradient-primary">FitLife Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="glass-effect" asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Member View
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Admin Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="card-gradient premium-shadow">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start glass-effect hover:bg-white/10"
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
