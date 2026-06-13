import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

// GET — list all users with stats
export async function GET() {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();

  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 200 });
  const { data: profiles } = await admin.from("profiles").select("id, plan, full_name, created_at");
  const { data: analyses } = await admin.from("analyses").select("user_id, status");
  const { data: usageToday } = await admin
    .from("daily_usage")
    .select("user_id, count")
    .eq("date", new Date().toISOString().split("T")[0]);

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
  const analysesCountMap: Record<string, number> = {};
  for (const a of analyses ?? []) {
    analysesCountMap[a.user_id] = (analysesCountMap[a.user_id] ?? 0) + 1;
  }
  const usageMap: Record<string, number> = {};
  for (const u of usageToday ?? []) {
    usageMap[u.user_id] = u.count;
  }

  const users = (authUsers?.users ?? []).map(u => ({
    id: u.id,
    email: u.email,
    fullName: profileMap[u.id]?.full_name ?? u.user_metadata?.full_name ?? null,
    plan: profileMap[u.id]?.plan ?? "free",
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at,
    banned: !!u.banned_until,
    totalAnalyses: analysesCountMap[u.id] ?? 0,
    usedToday: usageMap[u.id] ?? 0,
  }));

  return NextResponse.json({ users });
}

// POST — actions: upgrade, downgrade, ban, unban, reset_credits
export async function POST(req: NextRequest) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, action } = await req.json();
  if (!userId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const admin = createAdminClient();

  if (action === "upgrade") {
    await admin.from("profiles").update({ plan: "pro" }).eq("id", userId);
    return NextResponse.json({ ok: true, message: "Upgraded to Pro" });
  }

  if (action === "downgrade") {
    await admin.from("profiles").update({ plan: "free" }).eq("id", userId);
    return NextResponse.json({ ok: true, message: "Downgraded to Free" });
  }

  if (action === "reset_credits") {
    const today = new Date().toISOString().split("T")[0];
    await admin.from("daily_usage").delete().eq("user_id", userId).eq("date", today);
    return NextResponse.json({ ok: true, message: "Credits reset" });
  }

  if (action === "ban") {
    await admin.auth.admin.updateUserById(userId, {
      ban_duration: "876600h", // 100 years
    });
    return NextResponse.json({ ok: true, message: "User banned" });
  }

  if (action === "unban") {
    await admin.auth.admin.updateUserById(userId, {
      ban_duration: "none",
    });
    return NextResponse.json({ ok: true, message: "User unbanned" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
