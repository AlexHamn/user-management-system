"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPortal() {
  const [adminCount, setAdminCount] = useState(0);
  const [b2bCount, setB2bCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchCounts() {
      const { count: adminCount } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });

      const { count: b2bCount } = await supabase
        .from("b2b_users")
        .select("*", { count: "exact", head: true });

      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      setAdminCount(adminCount || 0);
      setB2bCount(b2bCount || 0);
      setCustomerCount(customerCount || 0);
    }

    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{adminCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>B2B Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{b2bCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{customerCount}</p>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
