import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPortal from "@/components/AdminPortal";
import { getUserType } from "@/lib/getUserType";

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userType = await getUserType(session.user.email!);

  if (userType !== "admin") {
    redirect("/unauthorized");
  }

  return <AdminPortal />;
}
