import { NextResponse } from "next/server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { generateLessonAI } from "@/lib/ai/generateLesson";
import { generateWorksheetAI } from "@/lib/ai/generateWorksheet";
import { generateTestAI } from "@/lib/ai/generateTest";
import { generateEvaluationAI } from "@/lib/ai/generateEvaluation";
import { generateQuestionsAI } from "@/lib/ai/generateQuestions";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminAuth = getAuth();
const db = getFirestore();

export async function POST(req: Request) {
  try {

    const authHeader = req.headers.get("authorization") || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(match[1]);
    const userId = decoded.uid;

    const { subject, grade, topic } = await req.json();

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    /* ---------- GENERARE ---------- */

    const lesson = await generateLessonAI(subject, grade, topic);

    const worksheet = await generateWorksheetAI(subject, grade, topic);

    const test = await generateTestAI(subject, grade, topic);

    const evaluation = await generateEvaluationAI(subject, grade, topic);

    const questions = await generateQuestionsAI(subject, grade, topic);

    /* ---------- SALVARE ---------- */

    const now = FieldValue.serverTimestamp();

    const batch = db.batch();

    const save = (type: string, content: string) => {
      const ref = db.collection("lessons").doc();
      batch.set(ref, {
        userId,
        subject,
        grade,
        topic,
        type,
        content,
        createdAt: now
      });
    };

    save("lesson", lesson);
    save("worksheet", worksheet);
    save("test", test);
    save("evaluation", evaluation);
    save("questions", questions);

    await batch.commit();

    return NextResponse.json({
      lesson,
      worksheet,
      test,
      evaluation,
      questions
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}