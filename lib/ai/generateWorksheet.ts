export async function generateWorksheetAI(subject:string,grade:string,topic:string){

const prompt=`
Creeaza o fisa de lucru pentru elevi.

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Include:

1. 5 intrebari scurte
2. 3 exercitii aplicate
3. 1 exercitiu creativ

Formuleaza pentru elevi.
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
max_tokens:900,
temperature:0.6
})
}
);

const data=await response.json();

return data?.choices?.[0]?.message?.content;
}