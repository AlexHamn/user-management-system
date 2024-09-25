// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getUserType } from "@/lib/getUserType";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const userType = await getUserType(user.email!);
      let redirectPath = "/";

      switch (userType) {
        case "admin":
          redirectPath = "/admin";
          break;
        case "b2b":
          redirectPath = "/b2b";
          break;
        case "customer":
          redirectPath = "/customer";
          break;
      }

      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth-error`);
}
