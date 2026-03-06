import { NextResponse } from "next/server";
import { generateQuestionsAI } from "@/lib/ai/generateQuestions";

export async function POST(req:Request){

const {subject,grade,topic}=await req.json();

const content=await generateQuestionsAI(subject,grade,topic);

return NextResponse.json({
content
});

}