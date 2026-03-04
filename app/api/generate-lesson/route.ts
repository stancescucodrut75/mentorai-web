import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const { subject, grade, topic } = body;

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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  return NextResponse.json({
    lesson: data.choices[0].message.content
  });

}