"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function B2BPortal() {
  const [companyName, setCompanyName] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchB2BData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("b2b_users")
          .select("company_name, account_balance, active_projects")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error fetching B2B data:", error);
          toast({
            title: "Error",
            description:
              "Failed to load your account data. Please try again later.",
            variant: "destructive",
          });
        } else if (data) {
          setCompanyName(data.company_name);
          setAccountBalance(data.account_balance);
          setActiveProjects(data.active_projects);
        }
      }
    }

    fetchB2BData();
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
      <h1 className="text-2xl font-bold mb-4">B2B Portal</h1>
      <h2 className="text-xl mb-4">Welcome, {companyName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${accountBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeProjects}</p>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
