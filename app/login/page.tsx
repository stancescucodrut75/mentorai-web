"use client";

import { useState } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function loginEmail(){
    try{
      await signInWithEmailAndPassword(auth,email,password);
      router.push("/dashboard");
    }catch(e){
      alert("Eroare autentificare");
    }
  }

  async function loginGoogle(){
    const provider = new GoogleAuthProvider();

    try{
      await signInWithPopup(auth,provider);
      router.push("/dashboard");
    }catch(e){
      alert("Eroare autentificare Google");
    }
  }

  return (

    <main className="relative min-h-screen flex flex-col md:flex-row bg-slate-950 text-white overflow-hidden">

      {/* glow background */}

      <div className="absolute w-[700px] h-[700px] bg-blue-600 opacity-20 blur-[120px] animate-pulse -top-40 -left-40"></div>

      {/* LEFT SIDE */}

      <div className="flex-1 flex items-center justify-center p-10 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900">

        <div className="max-w-md">

          <Image
            src="/logo.png"
            alt="MentorAI"
            width={160}
            height={160}
            className="mb-6"
          />

          <h1 className="text-4xl font-bold mb-6">
            MentorAI
          </h1>

          <p className="text-lg text-slate-300 mb-8">
            Asistent AI pentru profesori care genereaza planuri de lectie
            complete in cateva secunde.
          </p>

          <div className="space-y-3 text-slate-300">

            <div>📘 Scoala primara</div>
            <div>📗 Gimnaziu</div>
            <div>📙 Liceu</div>
            <div>📄 Export DOCX</div>
            <div>⚡ Generare rapida cu AI</div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE LOGIN */}

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Autentificare
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={loginEmail}
            className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-medium mb-4"
          >
            Autentificare
          </button>

          <button
            onClick={loginGoogle}
            className="w-full bg-white text-black hover:bg-gray-200 transition p-3 rounded-lg font-medium"
          >
            Continua cu Google
          </button>

          <div className="text-center text-slate-400 mt-6 text-sm">

            Nu ai cont?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:underline"
            >
              Creeaza cont
            </Link>

          </div>

          <div className="text-center mt-3 text-sm">

            <Link
              href="/pricing"
              className="text-slate-400 hover:text-white"
            >
              Vezi planurile de abonament
            </Link>

          </div>

        </div>

      </div>

    </main>

  );
}