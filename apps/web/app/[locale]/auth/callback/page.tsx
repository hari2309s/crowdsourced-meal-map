"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "../../providers";

export default function AuthCallback() {
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        await supabase.auth.getSession();
        router.push("/");
      } catch (error) {
        console.error("Error in auth callback:", error);
        router.push("/");
      }
    }
    handleCallback();
  }, [supabase, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-600">Processing authentication...</div>
    </div>
  );
}
