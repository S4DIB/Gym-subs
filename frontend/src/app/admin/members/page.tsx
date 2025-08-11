"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  plan: "Basic" | "Standard" | "Premium";
  status: "active" | "inactive" | "suspended" | "trial";
  subscriptionStatus: "active" | "cancelled" | "past_due" | "trialing";
  lastPayment: string;
  nextBilling: string;
  totalSessions: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2024-01-15",
      plan: "Premium",
      status: "active",
      subscriptionStatus: "active",
      lastPayment: "2024-12-01",
      nextBilling: "2025-01-01",
      totalSessions: 45,
      emergencyContact: {
        name: "Jane Smith",
        phone: "+1 (555) 123-4568",
        relationship: "Spouse"
      }
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com", 
      phone: "+1 (555) 234-5678",
      joinDate: "2024-03-20",
      plan: "Standard",
      status: "active",
      subscriptionStatus: "active",
      lastPayment: "2024-12-05",
      nextBilling: "2025-01-05",
      totalSessions: 32,
      emergencyContact: {
        name: "Mike Johnson",
        phone: "+1 (555) 234-5679",
        relationship: "Partner"
      }
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2024-11-01",
      plan: "Basic",
      status: "trial",
      subscriptionStatus: "trialing",
      lastPayment: "",
      nextBilling: "2024-12-15",
      totalSessions: 5
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-08-12",
      plan: "Premium",
      status: "suspended",
      subscriptionStatus: "past_due",
      lastPayment: "2024-10-12",
      nextBilling: "2024-11-12",
      totalSessions: 120
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesPlan = filterPlan === "all" || member.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleStatusChange = (memberId: string, newStatus: Member["status"]) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
    toast.success("Member status updated");
  };

  const handleSendEmail = (member: Member) => {
    toast.info(`Email sent to ${member.name}`);
  };

  const handleSuspendMember = (memberId: string) => {
    handleStatusChange(memberId, "suspended");
    toast.warning("Member suspended");
  };

  const handleReactivateMember = (memberId: string) => {
    handleStatusChange(memberId, "active");
    toast.success("Member reactivated");
  };

  const getStatusColor = (status: Member["status"]) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "trial": return "bg-blue-500";
      case "suspended": return "bg-red-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getSubscriptionStatusColor = (status: Member["subscriptionStatus"]) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "trialing": return "text-blue-600 bg-blue-100";
      case "past_due": return "text-red-600 bg-red-100";
      case "cancelled": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPlanColor = (plan: Member["plan"]) => {
    switch (plan) {
      case "Basic": return "text-blue-600 bg-blue-100";
      case "Standard": return "text-purple-600 bg-purple-100";
      case "Premium": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Member Management</h1>
          <p className="text-muted-foreground">View and manage gym members</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-effect">
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
          <Button className="btn-premium">
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{members.filter(m => m.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{members.filter(m => m.status === "trial").length}</p>
              <p className="text-sm text-muted-foreground">Trial Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{members.filter(m => m.status === "suspended").length}</p>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient premium-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{members.filter(m => m.subscriptionStatus === "past_due").length}</p>
              <p className="text-sm text-muted-foreground">Past Due</p>
            </div>
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
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="card-gradient premium-shadow">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Members ({filteredMembers.length})</CardTitle>
          <CardDescription>Complete list of gym members and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(member.plan)} variant="secondary">
                        {member.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(member.status)}`} />
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSubscriptionStatusColor(member.subscriptionStatus)} variant="secondary">
                        {member.subscriptionStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{member.totalSessions}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {member.subscriptionStatus === "past_due" && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{member.nextBilling ? new Date(member.nextBilling).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendEmail(member)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Member
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Billing
                          </DropdownMenuItem>
                          {member.status === "active" ? (
                            <DropdownMenuItem 
                              onClick={() => handleSuspendMember(member.id)}
                              className="text-red-600"
                            >
                              Suspend Member
                            </DropdownMenuItem>
                          ) : member.status === "suspended" ? (
                            <DropdownMenuItem 
                              onClick={() => handleReactivateMember(member.id)}
                              className="text-green-600"
                            >
                              Reactivate Member
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
