import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { interests, channelUrl } = await req.json();
  if (!interests || interests.length === 0) {
    return NextResponse.json({ error: "Select at least one category" }, { status: 400 });
  }

  const admin = createAdminClient();
  const updates: Record<string, unknown> = { onboarded: true, interests };
  if (channelUrl?.trim()) updates.onboarding_channel_url = channelUrl.trim();

  const { error } = await admin.from("profiles").upsert(
    { id: user.id, ...updates },
    { onConflict: "id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
