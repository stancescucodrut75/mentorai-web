"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function LessonResult({ lesson, setLesson }: any) {

  const [loading,setLoading] = useState<string | null>(null);

  if(!lesson) return null;

  async function generate(type:string){

    try{

      setLoading(type);

      const user = auth.currentUser;

      if(!user){
        alert("Nu esti autentificat");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch("/api/generate",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          subject:lesson.subject,
          grade:lesson.grade,
          topic:lesson.topic,
          type
        })
      });

      const data = await res.json();

      if(!res.ok){
        alert(data.error || "Eroare generare");
        return;
      }

      setLesson({
        ...lesson,
        type,
        content:data.content
      });

    }catch(err){

      console.error(err);
      alert("Server error");

    }finally{

      setLoading(null);

    }

  }

  return(

<div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

<div className="text-white whitespace-pre-wrap">
{lesson.content}
</div>

<div className="mt-6 flex gap-3 flex-wrap">

<button
disabled={loading!==null}
onClick={()=>generate("test")}
className="bg-blue-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
>
{loading==="test" ? "Se genereaza..." : "Genereaza test"}
</button>

<button
disabled={loading!==null}
onClick={()=>generate("worksheet")}
className="bg-green-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
>
{loading==="worksheet" ? "Se genereaza..." : "Genereaza fisa de lucru"}
</button>

<button
disabled={loading!==null}
onClick={()=>generate("evaluation")}
className="bg-yellow-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
>
{loading==="evaluation" ? "Se genereaza..." : "Genereaza evaluare"}
</button>

<button
disabled={loading!==null}
onClick={()=>generate("questions")}
className="bg-pink-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
>
{loading==="questions" ? "Se genereaza..." : "Genereaza intrebari orale"}
</button>

</div>

</div>

  );

}