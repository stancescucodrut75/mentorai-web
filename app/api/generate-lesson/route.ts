import { NextResponse } from "next/server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

function monthKey(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function POST(req: Request) {
  try {

    /* ---------------- AUTH ---------------- */

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

    /* ---------------- INPUT ---------------- */

    const body = await req.json();

    const { subject, grade, topic } = body as {
      subject?: string;
      grade?: string;
      topic?: string;
    };

    if (!subject || !grade || !topic) {
      return NextResponse.json(
        { error: "Date incomplete. Completeaza materie, clasa, tema." },
        { status: 400 }
      );
    }

    /* ---------------- PLAN CHECK ---------------- */

    const userRef = db.collection("users").doc(userId);

    const now = new Date();
    const nowMonth = monthKey(now);

    const quotaResult = await db.runTransaction(async (tx) => {

      const snap = await tx.get(userRef);

      if (!snap.exists) {

        tx.set(
          userRef,
          {
            uid: userId,
            plan: "free",
            monthKey: nowMonth,
            lessonsUsedThisMonth: 0,
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
      const planLimit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

      let lessonsUsedThisMonth: number = Number(data?.lessonsUsedThisMonth || 0);
      let freeUsed: number = Number(data?.freeUsed || 0);
      let extraCredits: number = Number(data?.extraCredits || 0);

      if (plan === "free") {

        if (freeUsed < planLimit) {

          tx.set(userRef,{
            freeUsed: freeUsed + 1,
            updatedAt: FieldValue.serverTimestamp()
          },{ merge:true });

          return { allowed:true };

        }

        if (extraCredits > 0) {

          tx.set(userRef,{
            extraCredits: extraCredits - 1,
            updatedAt: FieldValue.serverTimestamp()
          },{ merge:true });

          return { allowed:true };
        }

        return { allowed:false };
      }

      if (lessonsUsedThisMonth < planLimit) {

        tx.set(userRef,{
          lessonsUsedThisMonth: lessonsUsedThisMonth + 1,
          updatedAt: FieldValue.serverTimestamp()
        },{ merge:true });

        return { allowed:true };
      }

      if (extraCredits > 0) {

        tx.set(userRef,{
          extraCredits: extraCredits - 1,
          updatedAt: FieldValue.serverTimestamp()
        },{ merge:true });

        return { allowed:true };
      }

      return { allowed:false };

    });

    if (!quotaResult.allowed) {

      return NextResponse.json(
        { error: "Ai atins limita planului." },
        { status: 403 }
      );

    }

    /* ---------------- GENERATE LESSON ---------------- */

    const prompt = `
Creeaza un plan de lectie pentru:

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Structura:
- obiective
- introducere
- activitate principala
- exercitii
- evaluare
`;

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {

      console.error("OpenAI error:", await aiResponse.text());

      return NextResponse.json(
        { error: "Eroare AI." },
        { status: 500 }
      );
    }

    const data = await aiResponse.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Eroare la generare." },
        { status: 500 }
      );
    }

    /* ---------------- SAVE LESSON ---------------- */

    await db.collection("lessons").add({
      userId,
      subject,
      grade,
      topic,
      content,
      createdAt: FieldValue.serverTimestamp(),
    });

    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json({ lesson: content });

  } catch (err) {

    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: "Eroare server." },
      { status: 500 }
    );
  }
}