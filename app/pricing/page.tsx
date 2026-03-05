"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 md:p-12 relative overflow-hidden">

      {/* glow background */}

      <div className="absolute w-[700px] h-[700px] bg-blue-600 opacity-10 blur-[140px] -top-40 -left-40"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* header */}

        <div className="text-center mb-14">

          <h1 className="text-4xl font-bold mb-4">
            Planuri MentorAI
          </h1>

          <p className="text-slate-400">
            Alege planul potrivit pentru tine
          </p>

        </div>

        {/* cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* FREE */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl">

            <h3 className="text-xl font-semibold mb-2">
              Free
            </h3>

            <div className="text-4xl font-bold mb-6">
              0 lei
              <span className="text-sm text-slate-400"> / luna</span>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8">

              <li>✓ 10 planuri de lectie gratuite</li>
              <li>✓ planuri standard</li>
              <li>✓ export DOCX</li>
              <li>✓ istoric limitat</li>
              <li className="text-slate-400 text-sm">
                Perfect pentru a testa MentorAI
              </li>

            </ul>

            <Link
              href="/signup"
              className="block text-center bg-slate-800 hover:bg-slate-700 p-3 rounded-lg"
            >
              Incepe gratuit
            </Link>

          </div>

          {/* PROFESOR */}

          <div className="bg-slate-900 border border-blue-500 rounded-2xl p-8 shadow-2xl relative scale-105">

            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Cel mai popular
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Profesor
            </h3>

            <div className="text-4xl font-bold mb-6">
              49 lei
              <span className="text-sm text-slate-400"> / luna</span>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8">

              <li>✓ 100 planuri de lectie / luna</li>
              <li>✓ planuri detaliate</li>
              <li>✓ export DOCX + PDF</li>
              <li>✓ istoric complet</li>
              <li>✓ generare rapida</li>
              <li className="text-blue-300 text-sm">
                Folosit de majoritatea profesorilor
              </li>

            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold">
              Upgrade
            </button>

          </div>

          {/* PRO */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl">

            <h3 className="text-xl font-semibold mb-2">
              Pro Profesor
            </h3>

            <div className="text-4xl font-bold mb-6">
              99 lei
              <span className="text-sm text-slate-400"> / luna</span>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8">

              <li>✓ 500 planuri de lectie / luna</li>
              <li>✓ planuri foarte detaliate</li>
              <li>✓ export toate formatele</li>
              <li>✓ prioritate generare AI</li>
              <li>✓ suport prioritar</li>

            </ul>

            <button className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg">
              Upgrade
            </button>

          </div>

        </div>

        {/* back */}

        <div className="text-center mt-12">

          <Link
            href="/dashboard"
            className="text-blue-400 hover:underline"
          >
            ← inapoi la aplicatie
          </Link>

        </div>

      </div>

    </main>
  );
}