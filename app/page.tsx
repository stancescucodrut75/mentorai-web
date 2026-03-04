"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (user) => {

      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }

    });

    return () => unsub();

  }, []);

  return null;
}