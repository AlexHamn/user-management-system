import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import B2BPortal from "@/components/B2BPortal";
import { getUserType } from "@/lib/getUserType";

export default async function B2BPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userType = await getUserType(session.user.email!);

  if (userType !== "b2b") {
    redirect("/unauthorized");
  }

  return <B2BPortal />;
}
