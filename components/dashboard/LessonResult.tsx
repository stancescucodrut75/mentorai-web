"use client";

import { useState } from "react";
import { exportLessonDOCX } from "@/lib/exportDocx";
import { exportLessonPDF } from "@/lib/exportPdf";

export default function LessonResult({ lesson }: any) {

  const [open, setOpen] = useState(true);

  if (!lesson) return null;

  return (

    <div className="bg-zinc-900 p-6 rounded-xl mb-6">

      <div className="flex justify-between items-center mb-4">

        <div className="text-yellow-500 font-semibold">
          {lesson.subject} • Clasa {lesson.grade} • {lesson.topic}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-sm bg-zinc-700 px-3 py-1 rounded"
        >
          {open ? "Ascunde" : "Arata"}
        </button>

      </div>

      {open && (
        <>
          <div className="text-zinc-200 mb-6 whitespace-pre-wrap leading-relaxed">
            {lesson.content}
          </div>

          <div
            id="lesson-pdf"
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "800px",
              background: "#ffffff",
              color: "#000000",
              padding: "40px",
              fontFamily: "Arial"
            }}
          >
            <h1>MentorAI</h1>

            <p><b>Materie:</b> {lesson.subject}</p>
            <p><b>Clasa:</b> {lesson.grade}</p>
            <p><b>Tema:</b> {lesson.topic}</p>

            <hr />

            <pre style={{ whiteSpace: "pre-wrap" }}>
              {lesson.content}
            </pre>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => exportLessonDOCX(lesson)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded"
            >
              Export DOCX
            </button>

            <button
              onClick={() => exportLessonPDF()}
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-4 py-2 rounded"
            >
              Export PDF
            </button>

          </div>
        </>
      )}

    </div>

  );
}