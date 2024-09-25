import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getUserType(
  email: string
): Promise<"admin" | "b2b" | "customer" | null> {
  console.log("Fetching user type for", email);
  const supabase = createClientComponentClient();

  try {
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .single();

    if (adminError && adminError.code !== "PGRST116") {
      console.error("Error checking admin user:", adminError);
      throw new Error(`Admin user check failed: ${adminError.message}`);
    }
    if (adminUser) return "admin";

    const { data: b2bUser, error: b2bError } = await supabase
      .from("b2b_users")
      .select("email")
      .eq("email", email)
      .single();

    if (b2bError && b2bError.code !== "PGRST116") {
      console.error("Error checking b2b user:", b2bError);
      throw new Error(`B2B user check failed: ${b2bError.message}`);
    }
    if (b2bUser) return "b2b";

    const { data: customerUser, error: customerError } = await supabase
      .from("customers")
      .select("email")
      .eq("email", email)
      .single();

    if (customerError && customerError.code !== "PGRST116") {
      console.error("Error checking customer user:", customerError);
      throw new Error(`Customer user check failed: ${customerError.message}`);
    }
    if (customerUser) return "customer";

    console.log("No user type found for", email);
    return null;
  } catch (error) {
    console.error("Error in getUserType:", error);
    throw error;
  }
}
