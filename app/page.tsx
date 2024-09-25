"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";

const AdminPortal = React.lazy(() => import("@/components/AdminPortal"));
const B2BPortal = React.lazy(() => import("@/components/B2BPortal"));
const CustomerPortal = React.lazy(() => import("@/components/CustomerPortal"));

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Home component rendered", { user, loading });
  }, [user, loading]);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to Auth System</h1>
        <Button onClick={() => router.push("/login")}>Login</Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      {user.type === "admin" && <AdminPortal />}
      {user.type === "b2b" && <B2BPortal />}
      {user.type === "customer" && <CustomerPortal />}
      {!user.type && <div>Unknown user type</div>}
    </Suspense>
  );
}
