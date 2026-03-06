import { NextResponse } from "next/server";
import { generateWorksheetAI } from "@/lib/ai/generateWorksheet";

export async function POST(req:Request){

const {subject,grade,topic}=await req.json();

const content=await generateWorksheetAI(subject,grade,topic);

return NextResponse.json({
content
});

}