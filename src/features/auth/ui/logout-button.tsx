"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className ?? "dads-button"}
      data-size="sm"
      data-type="outline"
    >
      Logout
    </button>
  );
}
