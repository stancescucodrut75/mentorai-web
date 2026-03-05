"use client";

import { useState } from "react";
import { exportLessonDOCX } from "@/lib/exportDocx";
import { exportLessonPDF } from "@/lib/exportPdf";

export default function LessonResult({ lesson }: any) {

  const [open, setOpen] = useState(true);

  if (!lesson) return null;

  return (

    <div className="relative bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-8 mb-8 shadow-xl overflow-hidden">

      {/* glow subtil */}

      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[120px] -bottom-40 -right-40"></div>

      <div className="relative z-10">

        {/* header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div className="text-blue-400 font-semibold text-lg">
            {lesson.subject} • Clasa {lesson.grade} • {lesson.topic}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition"
          >
            {open ? "Ascunde lectia" : "Arata lectia"}
          </button>

        </div>

        {open && (

          <>
            {/* continut AI */}

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6 max-h-[600px] overflow-y-auto">

              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[15px]">
                {lesson.content}
              </div>

            </div>

            {/* export buttons */}

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => exportLessonDOCX(lesson)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
              >
                Export DOCX
              </button>

              <button
                onClick={() => exportLessonPDF()}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-lg transition"
              >
                Export PDF
              </button>

            </div>

            {/* container ascuns pentru pdf */}

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

          </>
        )}

      </div>

    </div>
  );
}