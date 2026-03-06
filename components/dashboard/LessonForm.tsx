"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function LessonForm({ setLesson }: any) {

  const [subject,setSubject]=useState("");
  const [grade,setGrade]=useState("");
  const [topic,setTopic]=useState("");
  const [type,setType]=useState("lesson");
  const [loading,setLoading]=useState(false);

  async function generate(){

    if(!subject || !grade || !topic){
      alert("Completeaza toate campurile");
      return;
    }

    try{

      setLoading(true);

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
          subject,
          grade,
          topic,
          type
        })
      });

      const data = await res.json();

      if(!res.ok){
        alert(data.error || "Eroare generare");
        return;
      }

      setLesson({
        subject,
        grade,
        topic,
        type,
        content:data.content
      });

    }catch(err){

      console.error(err);
      alert("Eroare server");

    }finally{

      setLoading(false);

    }

  }

  return(

    <div className="grid gap-4">

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="text-white text-lg">
            MentorAI genereaza materialul...
          </div>
        </div>
      )}

      <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
        className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
      >
        <option value="lesson">Plan lectie</option>
        <option value="worksheet">Fisa de lucru</option>
        <option value="test">Test</option>
        <option value="evaluation">Evaluare</option>
        <option value="questions">Intrebari orale</option>
      </select>

      <input
        value={subject}
        onChange={(e)=>setSubject(e.target.value)}
        placeholder="Materie"
        className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
      />

      <input
        value={grade}
        onChange={(e)=>setGrade(e.target.value)}
        placeholder="Clasa"
        className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
      />

      <input
        value={topic}
        onChange={(e)=>setTopic(e.target.value)}
        placeholder="Tema"
        className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
      />

      <button
        onClick={generate}
        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-semibold"
      >
        Genereaza material
      </button>

    </div>

  );

}