"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Star, Users, Calendar, Search } from "lucide-react";
import { toast } from "sonner";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  bio: string;
  rating: number;
  sessionsCompleted: number;
  status: "active" | "inactive" | "on_leave";
  joinDate: string;
  certifications: string[];
}

export default function TrainersPage() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    specialties: "",
    bio: "",
    certifications: ""
  });

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || trainer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTrainer = async () => {
    if (!newTrainer.name || !newTrainer.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const trainerData = {
        name: newTrainer.name,
        email: newTrainer.email,
        phone: newTrainer.phone,
        specialties: newTrainer.specialties.split(",").map(s => s.trim()).filter(Boolean),
        bio: newTrainer.bio,
        rating: 5.0,
        sessionsCompleted: 0,
        status: "active" as const,
        joinDate: new Date().toISOString().split("T")[0],
        certifications: newTrainer.certifications.split(",").map(c => c.trim()).filter(Boolean)
      };

      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trainerData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Trainer added successfully");
        setNewTrainer({ name: "", email: "", phone: "", specialties: "", bio: "", certifications: "" });
        setIsAddDialogOpen(false);
        // Refresh the trainers list
        fetchTrainers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add trainer");
      }
    } catch (error) {
      console.error('Error adding trainer:', error);
      toast.error("Failed to add trainer");
    }
  };

  const handleDeleteTrainer = (id: string) => {
    setTrainers(trainers.filter(t => t.id !== id));
    toast.success("Trainer removed");
  };

  const handleStatusChange = (id: string, status: Trainer["status"]) => {
    setTrainers(trainers.map(t => t.id === id ? { ...t, status } : t));
    toast.success("Trainer status updated");
  };

  const getStatusColor = (status: Trainer["status"]) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-red-500";
      case "on_leave": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Fetch trainers from database
  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('/api/trainers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrainers(data.trainers || []);
      } else {
        console.error('Failed to fetch trainers');
        toast.error('Failed to fetch trainers');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Error fetching trainers');
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trainers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Trainer Management</h1>
          <p className="text-muted-foreground">Manage your gym's training staff</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background border-2 border-border shadow-2xl solid-dialog">
            <DialogHeader>
              <DialogTitle>Add New Trainer</DialogTitle>
              <DialogDescription>
                Enter the trainer's information and qualifications.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTrainer.email}
                  onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                  placeholder="john@fitlife.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newTrainer.phone}
                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  value={newTrainer.specialties}
                  onChange={(e) => setNewTrainer({ ...newTrainer, specialties: e.target.value })}
                  placeholder="Yoga, Pilates, HIIT (comma separated)"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newTrainer.bio}
                  onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                  placeholder="Brief description of experience and background..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  value={newTrainer.certifications}
                  onChange={(e) => setNewTrainer({ ...newTrainer, certifications: e.target.value })}
                  placeholder="NASM-CPT, RYT-200 (comma separated)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTrainer} className="btn-premium">
                Add Trainer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="card-gradient premium-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <Card key={trainer.id} className="card-gradient premium-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {trainer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <CardDescription>{trainer.email}</CardDescription>
                  </div>
                </div>
                <div className={`h-3 w-3 rounded-full ${getStatusColor(trainer.status)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{trainer.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{trainer.sessionsCompleted} sessions</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {trainer.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {trainer.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{trainer.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {trainer.bio}
              </p>

              <div className="flex items-center justify-between pt-2">
                <Select value={trainer.status} onValueChange={(value) => handleStatusChange(trainer.id, value as Trainer["status"])}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-600/10"
                    onClick={() => handleDeleteTrainer(trainer.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainers.length === 0 && (
        <Card className="card-gradient premium-shadow">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Trainers Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filters."
                : "Get started by adding your first trainer."
              }
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button className="btn-premium" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Trainer
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
