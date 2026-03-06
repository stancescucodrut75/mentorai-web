export async function generateEvaluationAI(subject:string,grade:string,topic:string){

const prompt=`
Creeaza o evaluare rapida pentru profesori.

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Include:

- 5 intrebari orale
- 3 intrebari rapide de verificare
- criterii de evaluare
`;

const response=await fetch(
"https://api.openai.com/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${process.env.OPENAI_API_KEY}`
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:prompt}],
max_tokens:800,
temperature:0.6
})
}
);

const data=await response.json();

return data?.choices?.[0]?.message?.content;
}