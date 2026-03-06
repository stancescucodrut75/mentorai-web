import { NextResponse } from "next/server";
import { generateTestAI } from "@/lib/ai/generateTest";

export async function POST(req:Request){

const {subject,grade,topic}=await req.json();

const content=await generateTestAI(subject,grade,topic);

return NextResponse.json({
content
});

}