"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {

  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  return (

    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg hover:border-blue-500 hover:bg-slate-800 transition shadow-md"
    >

      {/* icon logout */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className="text-blue-400"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>

      <span className="text-white font-medium">
        Logout
      </span>

    </button>

  );

}