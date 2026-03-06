"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import StatsPanel from "@/components/dashboard/StatsPanel";
import LessonForm from "@/components/dashboard/LessonForm";
import LessonResult from "@/components/dashboard/LessonResult";
import LessonHistory from "@/components/dashboard/LessonHistory";
import LogoutButton from "@/components/dashboard/LogoutButton";

import Image from "next/image";

export default function Dashboard() {

  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsub();

  }, []);

  return (

    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10 relative overflow-hidden">

      {/* glow background */}

      <div className="absolute w-[700px] h-[700px] bg-blue-600 opacity-10 blur-[140px] -top-40 -left-40 animate-pulse"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-4">

            <Image
              src="/logo.png"
              alt="MentorAI"
              width={50}
              height={50}
            />

            <h1 className="text-2xl font-bold">
              MentorAI
            </h1>

          </div>

          <LogoutButton />

        </div>

        {/* STATISTICI */}

        <div className="mb-8">
          <StatsPanel />
        </div>

        {/* GENERATOR */}

        <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">

          <h2 className="text-xl font-semibold mb-4">
            Generator materiale AI
          </h2>

          <LessonForm setLesson={setLesson} />

        </div>

        {/* REZULTAT */}

        {lesson && (

          <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">

            <h2 className="text-xl font-semibold mb-4">
              Material generat
            </h2>

            <LessonResult
              lesson={lesson}
              setLesson={setLesson}
            />

          </div>

        )}

        {/* ISTORIC */}

        <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">

          <h2 className="text-xl font-semibold mb-4">
            Istoric materiale
          </h2>

          <LessonHistory
            onSelect={(lesson) => setLesson(lesson)}
          />

        </div>

      </div>

    </main>

  );
}