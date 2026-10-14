import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (see vercel.json) so the free Supabase
// project sees activity and doesn't get paused.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (
    !cronSecret ||
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("user_preferences")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    console.log(`Supabase keep-alive ok (${count} rows)`);
    return NextResponse.json({ ok: true, rows: count, at: new Date() });
  } catch (error) {
    console.error("Supabase keep-alive failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
