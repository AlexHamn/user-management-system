"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CustomerPortal() {
  const [customerName, setCustomerName] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCustomerData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("customers")
          .select("name, order_count, loyalty_points")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error fetching customer data:", error);
          toast({
            title: "Error",
            description:
              "Failed to load your account data. Please try again later.",
            variant: "destructive",
          });
        } else if (data) {
          setCustomerName(data.name);
          setOrderCount(data.order_count);
          setLoyaltyPoints(data.loyalty_points);
        }
      }
    }

    fetchCustomerData();
  }, [toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Portal</h1>
      <h2 className="text-xl mb-4">Welcome, {customerName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loyaltyPoints}</p>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
