import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];

  const [profileRes, usageRes, analysesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("daily_usage").select("count").eq("user_id", user.id).eq("date", today).single(),
    supabase.from("analyses").select("id, status, created_at, channel_id, channels(name, thumbnail_url, subscribers)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const plan = profileRes.data?.plan ?? "free";
  const dailyUsed = usageRes.data?.count ?? 0;
  const dailyLimit = plan === "pro" ? 999 : 3;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: profileRes.data?.full_name ?? user.user_metadata?.full_name,
      avatarUrl: profileRes.data?.avatar_url ?? user.user_metadata?.avatar_url,
      plan,
      dailyAnalysesUsed: dailyUsed,
      dailyAnalysesLimit: dailyLimit,
    },
    analyses: analysesRes.data ?? [],
  });
}
