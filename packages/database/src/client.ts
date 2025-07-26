import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Get environment variables from the consuming app
const supabaseUrl =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
const supabaseKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ??
  process.env["SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables:", {
    url: supabaseUrl ? "set" : "missing",
    key: supabaseKey ? "set" : "missing",
  });
  throw new Error(
    "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your app's .env file.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
