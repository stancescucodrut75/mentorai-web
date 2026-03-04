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
  createdAt?: any; // Timestamp
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
          console.error("LessonHistory onSnapshot error:", err);
          setLoading(false);
        }
      );

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, []);

  async function handleDelete(item: LessonItem) {
    const ok = window.confirm(
      `Stergi lectia?\n\n${item.subject} • Clasa ${item.grade} • ${item.topic}`
    );
    if (!ok) return;

    // optimistic UI
    setItems((prev) => prev.filter((x) => x.id !== item.id));

    try {
      await deleteDoc(doc(db, "lessons", item.id));
    } catch (e) {
      console.error("Delete lesson failed:", e);
      // fallback: refresh will restore via snapshot, but we can also re-add:
      setItems((prev) => [item, ...prev].sort((a, b) => (a.createdAt?.seconds ?? 0) < (b.createdAt?.seconds ?? 0) ? 1 : -1));
      alert("Nu am putut sterge lectia. Incearca din nou.");
    }
  }

  return (
    <section className="bg-zinc-900 p-6 rounded-xl mb-6">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="text-yellow-500 font-semibold">Istoric lectii</div>
        <div className="text-yellow-500">{expanded ? "▲" : "▼"}</div>
      </button>

      {!expanded ? null : (
        <div className="mt-4">
          {loading ? (
            <div className="text-zinc-400">Incarc istoric...</div>
          ) : items.length === 0 ? (
            <div className="text-zinc-400">Nu exista lectii salvate.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-yellow-400 font-semibold truncate">
                      {it.subject} • Clasa {it.grade}
                    </div>
                    <div className="text-zinc-300 truncate">{it.topic}</div>
                    {it.createdAt ? (
                      <div className="text-zinc-500 text-sm">
                        {formatDate(it.createdAt)}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelect?.(it)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-2 rounded"
                    >
                      Deschide
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(it)}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-3 py-2 rounded"
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
    </section>
  );
}