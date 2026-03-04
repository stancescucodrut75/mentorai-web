"use client";

import { useState } from "react";

export default function LessonForm({ setLesson }: any) {

  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");

  const [loading, setLoading] = useState(false);

async function generateLesson() {

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

    <div className="bg-zinc-900 p-6 rounded-xl mb-6">

      <div className="grid gap-4">

        <input
          className="p-2 bg-zinc-800 rounded text-white"
          placeholder="Materie"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="p-2 bg-zinc-800 rounded text-white"
          placeholder="Clasa"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <input
          className="p-2 bg-zinc-800 rounded text-white"
          placeholder="Tema"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateLesson}
          className="bg-yellow-500 text-black p-2 rounded"
        >
          {loading ? "Generez..." : "Genereaza lectie"}
        </button>

      </div>

    </div>

  );
}