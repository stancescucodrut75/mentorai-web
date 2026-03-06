"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

type LessonItem = {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  content: string;
  type?: string;
  createdAt?: any;
};

function formatDate(ts: any) {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

function getTypeLabel(type?: string) {
  if (type === "worksheet") return "Fisa de lucru";
  if (type === "test") return "Test";
  if (type === "evaluation") return "Evaluare";
  if (type === "questions") return "Intrebari orale";
  return "Plan lectie";
}

function getTypeBadgeClass(type?: string) {
  if (type === "worksheet") {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
  }

  if (type === "test") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
  }

  if (type === "evaluation") {
    return "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30";
  }

  if (type === "questions") {
    return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30";
  }

  return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
}

export default function LessonHistory({
  onSelect,
}: {
  onSelect?: (lesson: LessonItem) => void;
}) {
  const [items, setItems] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const q = query(
        collection(db, "lessons"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const unsubSnap = onSnapshot(
        q,
        (snap) => {
          const rows: LessonItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));

          setItems(rows);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, []);

  async function handleDelete(item: LessonItem) {
    const ok = window.confirm(
      `Stergi materialul?\n\n${getTypeLabel(item.type)}\n${item.subject} • Clasa ${item.grade} • ${item.topic}`
    );

    if (!ok) return;

    setItems((prev) => prev.filter((x) => x.id !== item.id));

    try {
      await deleteDoc(doc(db, "lessons", item.id));
    } catch {
      alert("Nu am putut sterge materialul.");
    }
  }

  return (
    <section className="relative bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[140px] -top-40 -right-40"></div>

      <div className="relative z-10">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="text-lg font-semibold text-blue-400">
            Istoric materiale
          </div>

          <div className="text-blue-400 text-sm">
            {expanded ? "▲" : "▼"}
          </div>
        </button>

        {!expanded ? null : (
          <div className="mt-4">
            {loading ? (
              <div className="text-slate-400">
                Incarc istoric...
              </div>
            ) : items.length === 0 ? (
              <div className="text-slate-400">
                Nu exista materiale salvate.
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4 transition hover:border-blue-500 hover:shadow-lg"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${getTypeBadgeClass(
                            it.type
                          )}`}
                        >
                          {getTypeLabel(it.type)}
                        </span>
                      </div>

                      <div className="text-blue-400 font-semibold truncate">
                        {it.subject} • Clasa {it.grade}
                      </div>

                      <div className="text-slate-300 truncate">
                        {it.topic}
                      </div>

                      {it.createdAt && (
                        <div className="text-slate-500 text-sm mt-1">
                          {formatDate(it.createdAt)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelect?.(it)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Deschide
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(it)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Sterge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}