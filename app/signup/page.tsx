"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc,setDoc,serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const router = useRouter();

  async function handleSignup(){

    try{

      const cred = await createUserWithEmailAndPassword(auth,email,password);

      const user = cred.user;

      await setDoc(doc(db,"users",user.uid),{
        uid:user.uid,
        email:user.email,
        role:"teacher",
        plan:"free",
        createdAt:serverTimestamp()
      });

      router.push("/dashboard");

    }catch(e){
      alert("Eroare creare cont");
    }

  }

  return(

    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Creeaza cont MentorAI
        </h1>

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
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-medium"
        >
          Creeaza cont
        </button>

        <div className="text-center text-slate-400 mt-6 text-sm">

          Ai deja cont?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Autentifica-te
          </Link>

        </div>

      </div>

    </main>

  );
}