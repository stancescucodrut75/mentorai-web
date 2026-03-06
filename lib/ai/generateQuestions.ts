export async function generateQuestionsAI(subject: string, grade: string, topic: string) {

  const prompt = `
Genereaza intrebari pentru discutie si verificare in clasa.

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Include:
1. 10 intrebari orale
2. 5 intrebari rapide de verificare
3. 2 intrebari pentru discutie in clasa

Scrie clar pentru profesori.
`;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.6
      })
    }
  );

  if (!response.ok) {
    throw new Error("AI generation failed");
  }

  const data = await response.json();

  return data?.choices?.[0]?.message?.content;
}