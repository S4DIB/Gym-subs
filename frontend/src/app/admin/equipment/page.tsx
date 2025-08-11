"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, AlertTriangle, CheckCircle, Clock, Wrench, Dumbbell, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  status: "available" | "in_use" | "maintenance" | "broken" | "retired";
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceInterval: number; // days
  notes: string;
  warrantyExpiry?: string;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: "1",
      name: "Treadmill Pro X1",
      category: "Cardio",
      brand: "TechnoGym",
      model: "Run Race 1400",
      serialNumber: "TG-RR1400-001",
      purchaseDate: "2023-01-15",
      purchasePrice: 8500,
      status: "available",
      location: "Main Cardio Area",
      lastMaintenance: "2024-11-01",
      nextMaintenance: "2025-02-01",
      maintenanceInterval: 90,
      notes: "Regular belt tension check needed",
      warrantyExpiry: "2026-01-15"
    },
    {
      id: "2",
      name: "Olympic Barbell Set",
      category: "Strength",
      brand: "Rogue Fitness",
      model: "Ohio Bar 45lb",
      serialNumber: "RF-OB45-002",
      purchaseDate: "2022-08-20",
      purchasePrice: 1200,
      status: "available",
      location: "Free Weights Area",
      lastMaintenance: "2024-10-15",
      nextMaintenance: "2025-01-15",
      maintenanceInterval: 120,
      notes: "Check for bent bars during inspection"
    },
    {
      id: "3",
      name: "Leg Press Machine",
      category: "Strength",
      brand: "Hammer Strength",
      model: "Plate Loaded",
      serialNumber: "HS-LP-003",
      purchaseDate: "2023-06-10",
      purchasePrice: 4800,
      status: "maintenance",
      location: "Strength Training Area",
      lastMaintenance: "2024-12-01",
      nextMaintenance: "2024-12-15",
      maintenanceInterval: 60,
      notes: "Hydraulic system needs inspection",
      warrantyExpiry: "2025-06-10"
    },
    {
      id: "4",
      name: "Rowing Machine",
      category: "Cardio",
      brand: "Concept2",
      model: "Model D",
      serialNumber: "C2-MD-004",
      purchaseDate: "2023-03-12",
      purchasePrice: 1100,
      status: "broken",
      location: "Cardio Area",
      lastMaintenance: "2024-09-20",
      nextMaintenance: "2024-12-20",
      maintenanceInterval: 90,
      notes: "Chain mechanism broken - parts ordered"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    purchasePrice: 0,
    location: "",
    maintenanceInterval: 90,
    notes: "",
    warrantyExpiry: ""
  });

  const categories = ["Cardio", "Strength", "Free Weights", "Functional", "Accessories"];
  const locations = ["Main Cardio Area", "Strength Training Area", "Free Weights Area", "Functional Training Zone", "Studio A", "Studio B", "Storage"];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.category) {
      toast.error("Name and category are required");
      return;
    }

    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment.name,
      category: newEquipment.category,
      brand: newEquipment.brand,
      model: newEquipment.model,
      serialNumber: newEquipment.serialNumber,
      purchaseDate: newEquipment.purchaseDate,
      purchasePrice: newEquipment.purchasePrice,
      status: "available",
      location: newEquipment.location,
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + newEquipment.maintenanceInterval * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maintenanceInterval: newEquipment.maintenanceInterval,
      notes: newEquipment.notes,
      warrantyExpiry: newEquipment.warrantyExpiry
    };

    setEquipment(prev => [...prev, equipment]);
    setNewEquipment({
      name: "", category: "", brand: "", model: "", serialNumber: "",
      purchaseDate: "", purchasePrice: 0, location: "", maintenanceInterval: 90,
      notes: "", warrantyExpiry: ""
    });
    setIsAddDialogOpen(false);
    toast.success("Equipment added successfully");
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    toast.success("Equipment removed");
  };

  const handleStatusChange = (id: string, status: Equipment["status"]) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    toast.success("Equipment status updated");
  };

  const handleMaintenanceComplete = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        const nextMaintenanceDate = new Date(Date.now() + item.maintenanceInterval * 24 * 60 * 60 * 1000);
        return {
          ...item,
          status: "available",
          lastMaintenance: today,
          nextMaintenance: nextMaintenanceDate.toISOString().split("T")[0]
        };
      }
      return item;
    }));
    toast.success("Maintenance completed and next service scheduled");
  };

  const getStatusColor = (status: Equipment["status"]) => {
    switch (status) {
      case "available": return "text-green-600 bg-green-100";
      case "in_use": return "text-blue-600 bg-blue-100";
      case "maintenance": return "text-yellow-600 bg-yellow-100";
      case "broken": return "text-red-600 bg-red-100";
      case "retired": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: Equipment["status"]) => {
    switch (status) {
      case "available": return <CheckCircle className="h-4 w-4" />;
      case "in_use": return <Clock className="h-4 w-4" />;
      case "maintenance": return <Wrench className="h-4 w-4" />;
      case "broken": return <AlertTriangle className="h-4 w-4" />;
      case "retired": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Equipment Management</h1>
          <p className="text-muted-foreground">Track and maintain your gym equipment</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Register new equipment in your gym inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentName">Equipment Name *</Label>
                <Input
                  id="equipmentName"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  placeholder="Treadmill Pro X1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newEquipment.category} onValueChange={(value) => setNewEquipment({ ...newEquipment, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newEquipment.brand}
                  onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                  placeholder="TechnoGym"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                  placeholder="Run Race 1400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                  placeholder="TG-RR1400-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newEquipment.location} onValueChange={(value) => setNewEquipment({ ...newEquipment, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newEquipment.purchaseDate}
                  onChange={(e) => setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={newEquipment.purchasePrice}
                  onChange={(e) => setNewEquipment({ ...newEquipment, purchasePrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceInterval">Maintenance Interval (days)</Label>
                <Input
                  id="maintenanceInterval"
                  type="number"
                  value={newEquipment.maintenanceInterval}
                  onChange={(e) => setNewEquipment({ ...newEquipment, maintenanceInterval: parseInt(e.target.value) || 90 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={newEquipment.warrantyExpiry}
                  onChange={(e) => setNewEquipment({ ...newEquipment, warrantyExpiry: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEquipment.notes}
                  onChange={(e) => setNewEquipment({ ...newEquipment, notes: e.target.value })}
                  placeholder="Additional notes about the equipment..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEquipment} className="btn-premium">
                Add Equipment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{equipment.filter(e => e.status === "available").length}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{equipment.filter(e => e.status === "in_use").length}</p>
            <p className="text-sm text-muted-foreground">In Use</p>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{equipment.filter(e => e.status === "maintenance").length}</p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{equipment.filter(e => e.status === "broken").length}</p>
            <p className="text-sm text-muted-foreground">Broken</p>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{equipment.filter(e => isMaintenanceDue(e.nextMaintenance)).length}</p>
            <p className="text-sm text-muted-foreground">Due Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-gradient premium-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card className="card-gradient premium-shadow">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Equipment Inventory ({filteredEquipment.length})</CardTitle>
          <CardDescription>Complete list of gym equipment and maintenance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.brand} {item.model}
                        </p>
                        {item.serialNumber && (
                          <p className="text-xs text-muted-foreground">S/N: {item.serialNumber}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)} variant="secondary">
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status.replace("_", " ")}</span>
                          </span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {isMaintenanceDue(item.nextMaintenance) && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        <span className={isMaintenanceDue(item.nextMaintenance) ? "text-orange-600 font-medium" : ""}>
                          {new Date(item.nextMaintenance).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value as Equipment["status"])}>
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="in_use">In Use</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="broken">Broken</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                        {item.status === "maintenance" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-green-600 hover:bg-green-600/10"
                            onClick={() => handleMaintenanceComplete(item.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-600/10"
                          onClick={() => handleDeleteEquipment(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
