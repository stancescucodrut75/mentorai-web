"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 md:p-12 relative overflow-hidden">

      {/* background glow */}

      <div className="absolute w-[700px] h-[700px] bg-blue-600 opacity-10 blur-[140px] -top-40 -left-40"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-10 blur-[140px] bottom-0 right-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h1 className="text-5xl font-bold mb-6">
            Creeaza planuri de lectie in <span className="text-blue-400">secunde</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            MentorAI genereaza automat planuri de lectie complete cu ajutorul inteligentei artificiale.
            Economisesti ore de pregatire in fiecare saptamana.
          </p>

        </div>

        {/* PLANS */}

        <div className="grid md:grid-cols-3 gap-8 mb-24">

          {/* FREE */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl hover:scale-105 transition">

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

            </ul>

            <Link
              href="/signup"
              className="block text-center bg-slate-800 hover:bg-slate-700 p-3 rounded-lg font-semibold"
            >
              Incepe gratuit
            </Link>

          </div>

          {/* PROFESOR */}

          <div className="bg-slate-900 border border-blue-500 rounded-2xl p-10 shadow-2xl relative scale-110">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
              CEL MAI POPULAR
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Profesor
            </h3>

            <div className="text-5xl font-bold mb-6 text-blue-400">
              49 lei
              <span className="text-sm text-slate-400"> / luna</span>
            </div>

            <ul className="space-y-3 text-slate-300 mb-8">

              <li>✓ 100 planuri de lectie / luna</li>
              <li>✓ planuri detaliate</li>
              <li>✓ export DOCX + PDF</li>
              <li>✓ istoric complet</li>
              <li>✓ generare AI mai rapida</li>

              <li className="text-blue-300 text-sm">
                Folosit de majoritatea profesorilor
              </li>

            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold text-lg shadow-lg">
              Alege planul Profesor
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Se poate anula oricand
            </p>

          </div>

          {/* PRO */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl hover:scale-105 transition">

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

            <button className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg font-semibold">
              Alege planul Pro
            </button>

          </div>

        </div>

        {/* CREDIT PACKS */}

        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold mb-3">
            Pachete de lectii
          </h2>

          <p className="text-slate-400">
            Nu doresti abonament? Cumpara doar cate lectii ai nevoie.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur shadow-xl hover:scale-105 transition">

            <h3 className="text-xl font-semibold mb-2">
              10 lectii
            </h3>

            <div className="text-4xl font-bold mb-6">
              9 lei
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold">
              Cumpara
            </button>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur shadow-xl hover:scale-105 transition">

            <h3 className="text-xl font-semibold mb-2">
              25 lectii
            </h3>

            <div className="text-4xl font-bold mb-6">
              19 lei
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold">
              Cumpara
            </button>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur shadow-xl hover:scale-105 transition">

            <h3 className="text-xl font-semibold mb-2">
              50 lectii
            </h3>

            <div className="text-4xl font-bold mb-6">
              29 lei
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold">
              Cumpara
            </button>

          </div>

        </div>

        {/* BACK */}

        <div className="text-center">

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