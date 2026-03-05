"use client";

import { useState } from "react";

export default function LessonForm({ setLesson }: any) {

  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateLesson() {

    if (!subject || !grade || !topic) {
      alert("Completeaza toate campurile");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/generate-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject,
        grade,
        topic
      })
    });

    const data = await res.json();

    setLesson({
      subject,
      grade,
      topic,
      content: data.lesson
    });

    setLoading(false);
  }

  return (

    <div className="relative bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl overflow-hidden">

      {/* glow subtle */}

      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-10 blur-[120px] -top-20 -right-20"></div>

      <div className="relative z-10 grid gap-5">

        <h2 className="text-xl font-semibold text-white">
          Generator plan lectie
        </h2>

        <input
          className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          placeholder="Materie (ex: Matematica)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          placeholder="Clasa (ex: a VII-a)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <input
          className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          placeholder="Tema lectiei"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateLesson}
          className="bg-blue-600 hover:bg-blue-500 transition text-white font-semibold p-3 rounded-lg shadow-lg"
        >
          {loading ? "Generez lectia..." : "Genereaza lectie"}
        </button>

      </div>

    </div>

  );
}