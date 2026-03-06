import { NextResponse } from "next/server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { generateLessonAI } from "@/lib/ai/generateLesson";

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

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  profesor: 100,
  pro: 500,
};

export async function POST(req: Request) {
  try {

    /* ---------- AUTH ---------- */

    const authHeader = req.headers.get("authorization") || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return NextResponse.json(
        { error: "Neautorizat. Lipseste token." },
        { status: 401 }
      );
    }

    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    /* ---------- INPUT ---------- */

    const body = await req.json();

    const { subject, grade, topic } = body as {
      subject?: string;
      grade?: string;
      topic?: string;
    };

    if (!subject || !grade || !topic) {
      return NextResponse.json(
        { error: "Date incomplete." },
        { status: 400 }
      );
    }

    /* ---------- PLAN / QUOTA ---------- */

    const userRef = db.collection("users").doc(userId);

    const quotaResult = await db.runTransaction(async (tx) => {

      const snap = await tx.get(userRef);

      if (!snap.exists) {
        tx.set(
          userRef,
          {
            uid: userId,
            plan: "free",
            freeUsed: 0,
            extraCredits: 0,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      const data = (snap.exists ? snap.data() : {}) as any;

      const plan: string = data?.plan || "free";
      const limit = PLAN_LIMITS[plan];

      const freeUsed: number = Number(data?.freeUsed || 0);
      const extraCredits: number = Number(data?.extraCredits || 0);

      if (plan === "free") {

        if (freeUsed < limit) {

          tx.set(
            userRef,
            {
              freeUsed: freeUsed + 1,
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

          return { allowed: true };
        }

        if (extraCredits > 0) {

          tx.set(
            userRef,
            {
              extraCredits: extraCredits - 1,
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

          return { allowed: true };
        }

        return { allowed: false };
      }

      return { allowed: true };
    });

    if (!quotaResult.allowed) {
      return NextResponse.json(
        { error: "Ai atins limita planului." },
        { status: 403 }
      );
    }

    /* ---------- AI CACHE ---------- */

    const cacheQuery = await db
      .collection("lessons")
      .where("userId", "==", userId)
      .where("subject", "==", subject)
      .where("grade", "==", grade)
      .where("topic", "==", topic)
      .limit(1)
      .get();

    if (!cacheQuery.empty) {

      const cached = cacheQuery.docs[0].data();

      return NextResponse.json({
        lesson: cached.content,
        cached: true
      });
    }

    /* ---------- GENERATE LESSON ---------- */

    const content = await generateLessonAI(subject, grade, topic);

    if (!content) {
      return NextResponse.json(
        { error: "Eroare generare lectie." },
        { status: 500 }
      );
    }

    /* ---------- SAVE LESSON ---------- */

    await db.collection("lessons").add({
      userId,
      subject,
      grade,
      topic,
      type: "lesson",
      content,
      createdAt: FieldValue.serverTimestamp(),
    });

    /* ---------- RESPONSE ---------- */

    return NextResponse.json({
      lesson: content,
      cached: false
    });

  } catch (err) {

    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: "Eroare server." },
      { status: 500 }
    );
  }
}