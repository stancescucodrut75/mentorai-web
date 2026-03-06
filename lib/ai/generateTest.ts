export async function generateTestAI(subject:string,grade:string,topic:string){

const prompt=`
Genereaza un test pentru elevi.

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Include:

- 5 intrebari grila
- 3 intrebari deschise
- 1 exercitiu aplicativ

Adauga raspunsurile corecte la final.
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