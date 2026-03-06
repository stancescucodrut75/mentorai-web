export async function generateLessonAI(subject:string,grade:string,topic:string){

const prompt=`
Esti un profesor experimentat.

Genereaza un plan de lectie clar pentru:

Materie: ${subject}
Clasa: ${grade}
Tema: ${topic}

Structura:

1. Obiective de invatare
2. Introducere (5 minute)
3. Activitate principala
4. Exercitii
5. Evaluare
6. Tema optionala

Scrie clar pentru profesori.
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
messages:[
{role:"user",content:prompt}
],
max_tokens:900,
temperature:0.6
})
}
);

if(!response.ok){
throw new Error("AI generation failed");
}

const data=await response.json();

return data?.choices?.[0]?.message?.content;

}