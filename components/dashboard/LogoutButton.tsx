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
      className="text-yellow-500 underline"
    >
      Logout
    </button>

  );
}