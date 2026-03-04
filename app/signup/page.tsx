"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignup() {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "teacher",
        plan: "free",
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Eroare creare cont");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Signup</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Parola"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup}>
        Create account
      </button>
    </main>
  );
}