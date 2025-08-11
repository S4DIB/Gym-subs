"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, Download, ExternalLink, Loader2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  trial_end?: number;
  cancel_at_period_end: boolean;
  plan: {
    nickname?: string;
    amount: number;
    interval: string;
  };
}

interface BillingData {
  subscription: Subscription | null;
  upcoming_invoice?: {
    amount_due: number;
    period_start: number;
    period_end: number;
  } | null;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/billing', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      } else {
        console.error('Failed to fetch billing data');
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillingAction = async (action: string) => {
    setActionLoading(action);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok) {
        if (action === 'portal') {
          window.open(data.url, '_blank');
        } else {
          toast.success('Subscription updated successfully');
          fetchBillingData();
        }
      } else {
        throw new Error(data.error || 'Failed to perform action');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient">
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subscription = billingData?.subscription;

  return (
    <div className="min-h-screen premium-gradient">
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your membership and billing information</p>
          </div>

          {!subscription ? (
            <Card className="card-gradient premium-shadow">
              <CardContent className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have an active subscription. Choose a plan to get started.
                </p>
                <Button className="btn-premium" asChild>
                  <a href="/join">Choose a Plan</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Current Subscription */}
              <Card className="card-gradient premium-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gradient-primary">Current Plan</CardTitle>
                      <CardDescription>Your active membership details</CardDescription>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Plan</div>
                      <div className="font-semibold">
                        {subscription.plan.nickname || 'Premium'} Plan
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="font-semibold">
                        {formatAmount(subscription.plan.amount)}/{subscription.plan.interval}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Period</div>
                      <div className="font-semibold">
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Next Billing</div>
                      <div className="font-semibold">
                        {subscription.cancel_at_period_end 
                          ? 'Cancelled at period end' 
                          : formatDate(subscription.current_period_end)
                        }
                      </div>
                    </div>
                  </div>

                  {subscription.trial_end && subscription.trial_end > Date.now() / 1000 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-700">Free Trial Active</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        Your trial ends on {formatDate(subscription.trial_end)}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleBillingAction('portal')}
                      disabled={actionLoading === 'portal'}
                      className="glass-effect"
                    >
                      {actionLoading === 'portal' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 mr-2" />
                      )}
                      Manage Billing
                    </Button>

                    {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                      <Button
                        variant="outline"
                        onClick={() => handleBillingAction('cancel')}
                        disabled={actionLoading === 'cancel'}
                        className="glass-effect text-red-600 border-red-600/20 hover:bg-red-600/10"
                      >
                        {actionLoading === 'cancel' ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          'Cancel Subscription'
                        )}
                      </Button>
                    )}

                    {subscription.cancel_at_period_end && (
                      <Button
                        variant="outline"
                        onClick={() => handleBillingAction('reactivate')}
                        disabled={actionLoading === 'reactivate'}
                        className="glass-effect text-green-600 border-green-600/20 hover:bg-green-600/10"
                      >
                        {actionLoading === 'reactivate' ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          'Reactivate Subscription'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Invoice */}
              {billingData?.upcoming_invoice && (
                <Card className="card-gradient premium-shadow">
                  <CardHeader>
                    <CardTitle className="text-gradient-primary">Next Invoice</CardTitle>
                    <CardDescription>Your upcoming billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Amount Due</div>
                        <div className="text-2xl font-bold">
                          {formatAmount(billingData.upcoming_invoice.amount_due)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Billing Period</div>
                        <div className="font-semibold">
                          {formatDate(billingData.upcoming_invoice.period_start)} - {formatDate(billingData.upcoming_invoice.period_end)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Due Date</div>
                        <div className="font-semibold">
                          {formatDate(billingData.upcoming_invoice.period_end)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
