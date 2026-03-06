"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function StatsPanel() {

  const [stats, setStats] = useState({
    lesson: 0,
    worksheet: 0,
    test: 0,
    evaluation: 0,
    questions: 0
  });

  useEffect(() => {

    const unsubAuth = onAuthStateChanged(auth, (user) => {

      if (!user) return;

      const q = query(
        collection(db, "lessons"),
        where("userId", "==", user.uid)
      );

      const unsub = onSnapshot(q, (snap) => {

        let lesson = 0;
        let worksheet = 0;
        let test = 0;
        let evaluation = 0;
        let questions = 0;

        snap.docs.forEach((doc) => {

          const data: any = doc.data();

          if (data.type === "lesson") lesson++;
          if (data.type === "worksheet") worksheet++;
          if (data.type === "test") test++;
          if (data.type === "evaluation") evaluation++;
          if (data.type === "questions") questions++;

        });

        setStats({
          lesson,
          worksheet,
          test,
          evaluation,
          questions
        });

      });

      return () => unsub();

    });

    return () => unsubAuth();

  }, []);

  const total =
    stats.lesson +
    stats.worksheet +
    stats.test +
    stats.evaluation +
    stats.questions;

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

      <h2 className="text-lg font-semibold text-white mb-6">
        Statistici profesor
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <Stat label="Lectii" value={stats.lesson} color="blue" />
        <Stat label="Fise lucru" value={stats.worksheet} color="green" />
        <Stat label="Teste" value={stats.test} color="yellow" />
        <Stat label="Evaluari" value={stats.evaluation} color="purple" />
        <Stat label="Intrebari" value={stats.questions} color="pink" />
        <Stat label="Total materiale" value={total} color="cyan" />

      </div>

    </div>

  );
}

const colorClasses: any = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  green: "bg-green-500/10 border-green-500/20 text-green-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
};

function Stat({ label, value, color }: any) {

  const cls = colorClasses[color] || colorClasses.blue;

  return (

    <div className={`${cls} border rounded-lg p-4`}>

      <div className="text-sm">
        {label}
      </div>

      <div className="text-white text-2xl font-bold">
        {value}
      </div>

    </div>

  );

}