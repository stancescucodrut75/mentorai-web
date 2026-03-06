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

export async function POST(req: Request) {
  try {

    /* AUTH */

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

    /* INPUT */

    const body = await req.json();
    const { subject, grade, topic } = body;

    if (!subject || !grade || !topic) {
      return NextResponse.json(
        { error: "Date incomplete." },
        { status: 400 }
      );
    }

    /* PLAN CHECK */

    const userRef = db.collection("users").doc(userId);

    const quota = await db.runTransaction(async (tx) => {

      const snap = await tx.get(userRef);

      if (!snap.exists) {
        tx.set(userRef,{
          uid:userId,
          plan:"free",
          freeUsed:0,
          extraCredits:0,
          createdAt:FieldValue.serverTimestamp()
        },{merge:true});
      }

      const data = (snap.exists ? snap.data() : {}) as any;

      const plan = data?.plan || "free";
      const limit = PLAN_LIMITS[plan];

      const freeUsed = Number(data?.freeUsed || 0);
      const extraCredits = Number(data?.extraCredits || 0);

      if (plan === "free") {

        if (freeUsed < limit) {

          tx.set(userRef,{
            freeUsed:freeUsed+1,
            updatedAt:FieldValue.serverTimestamp()
          },{merge:true});

          return {allowed:true};
        }

        if (extraCredits>0){

          tx.set(userRef,{
            extraCredits:extraCredits-1,
            updatedAt:FieldValue.serverTimestamp()
          },{merge:true});

          return {allowed:true};
        }

        return {allowed:false};
      }

      return {allowed:true};

    });

    if (!quota.allowed) {
      return NextResponse.json(
        { error: "Ai atins limita planului." },
        { status: 403 }
      );
    }

    /* PROMPT OPTIMIZAT */

    const prompt = `
Esti un profesor experimentat.

Genereaza un plan de lectie clar si structurat pentru:

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Structura:

1. Obiective de invatare (3-5)
2. Introducere in lectie (5 minute)
3. Activitate principala
4. Exercitii pentru elevi
5. Evaluare rapida
6. Tema pentru acasa (optional)

Scrie concis si structurat pentru profesori.
`;

    /* OPENAI */

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model:"gpt-4o-mini",
          messages:[
            {role:"user",content:prompt}
          ],
          max_tokens:900,
          temperature:0.6
        })
      }
    );

    if (!aiResponse.ok) {

      const err = await aiResponse.text();
      console.error("OpenAI error:",err);

      return NextResponse.json(
        {error:"Eroare generare AI"},
        {status:500}
      );
    }

    const data = await aiResponse.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {error:"AI nu a returnat continut"},
        {status:500}
      );
    }

    /* SALVARE LECTIE */

    await db.collection("lessons").add({
      userId,
      subject,
      grade,
      topic,
      content,
      createdAt:FieldValue.serverTimestamp()
    });

    /* RESPONSE */

    return NextResponse.json({lesson:content});

  } catch(err){

    console.error("API ERROR:",err);

    return NextResponse.json(
      {error:"Eroare server"},
      {status:500}
    );
  }
}