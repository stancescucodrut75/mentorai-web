"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginEmail() {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Login error");
    }
  }

  async function loginGoogle() {

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Google login error");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>MentorAI Login</h1>

      <div style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={loginEmail}>
          Login with Email
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={loginGoogle}>
          Login with Google
        </button>
      </div>
    </main>
  );
}