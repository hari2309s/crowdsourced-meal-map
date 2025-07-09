"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import { useSupabase } from "@/providers";
import { useRouter } from "next/navigation";

const AuthButton = () => {
  const t = useTranslations("Header");
  const { supabase } = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="btn btn-secondary btn-sm flex items-center"
        >
          <User className="h-4 w-4 mr-1" />
          {t("signOut")}
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="h-9 flex justify-center items-center cursor-pointer bg-stone-700 text-white border-[1px] border-dashed border-stone-700 rounded-lg p-2 hover:bg-stone-900 disabled:cursor-not-allowed"
          disabled
        >
          <User className="h-4 w-4 mr-1" />
          {t("signIn")}
        </button>
      )}
    </div>
  );
};

export default AuthButton;
