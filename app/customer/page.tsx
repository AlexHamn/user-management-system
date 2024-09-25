import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CustomerPortal from "@/components/CustomerPortal";
import { getUserType } from "@/lib/getUserType";

export default async function CustomerPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userType = await getUserType(session.user.email!);

  if (userType !== "customer") {
    redirect("/unauthorized");
  }

  return <CustomerPortal />;
}
