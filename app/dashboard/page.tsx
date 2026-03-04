"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import LessonForm from "@/components/dashboard/LessonForm";
import LessonResult from "@/components/dashboard/LessonResult";
import LessonHistory from "@/components/dashboard/LessonHistory";
import LogoutButton from "@/components/dashboard/LogoutButton";

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

    <main className="min-h-screen bg-zinc-950 text-yellow-400 p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          MentorAI
        </h1>

        <LessonForm setLesson={setLesson} />

        <LessonResult lesson={lesson} />

        <LessonHistory onSelect={(lesson) => setLesson(lesson)} />

        <LogoutButton />

      </div>

    </main>

  );
}