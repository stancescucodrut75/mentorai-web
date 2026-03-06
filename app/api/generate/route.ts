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

    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    const { subject, grade, topic, type } = await req.json();

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    let content: string | null = null;

    if (type === "lesson") {
      content = await generateLessonAI(subject, grade, topic);
    }

    if (type === "worksheet") {
      content = await generateWorksheetAI(subject, grade, topic);
    }

    if (type === "test") {
      content = await generateTestAI(subject, grade, topic);
    }

    if (type === "evaluation") {
      content = await generateEvaluationAI(subject, grade, topic);
    }

    if (type === "questions") {
      content = await generateQuestionsAI(subject, grade, topic);
    }

    if (!content) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    await db.collection("lessons").add({
      userId,
      subject,
      grade,
      topic,
      type,
      content,
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ content });

  } catch (err) {

    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }

}