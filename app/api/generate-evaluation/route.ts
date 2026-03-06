import { NextResponse } from "next/server";
import { generateEvaluationAI } from "@/lib/ai/generateEvaluation";

export async function POST(req:Request){

const {subject,grade,topic}=await req.json();

const content=await generateEvaluationAI(subject,grade,topic);

return NextResponse.json({
content
});

}