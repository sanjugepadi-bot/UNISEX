import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  if (error) {
    return (
      <main style={{ padding: "2rem", fontFamily: "monospace" }}>
        <h1 style={{ color: "crimson" }}>Supabase Connection Failed</h1>
        <p>Message: {error.message}</p>
        <p>Status: {error.status ?? "unknown"}</p>
        <p>Name: {error.name}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1 style={{ color: "seagreen" }}>Supabase Connected Successfully</h1>
    </main>
  );
}
