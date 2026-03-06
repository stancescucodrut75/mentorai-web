import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel
} from "docx";

import { saveAs } from "file-saver";

type Lesson = {
  subject: string;
  grade: string;
  topic: string;
  content: string;
  type?: string;
};

function getTitle(type?: string) {

  if (type === "worksheet") return "FISA DE LUCRU";
  if (type === "test") return "TEST";
  if (type === "evaluation") return "EVALUARE RAPIDA";
  if (type === "questions") return "INTREBARI ORALE";

  return "PLAN DE LECTIE";
}

export async function exportLessonDOCX(lesson: Lesson): Promise<void> {

  const now = new Date();

  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const fileDate = now.toISOString().replace(/[:.]/g, "-");

  const lines = lesson.content.split("\n");

  const contentParagraphs = lines.map((line: string) =>
    new Paragraph({
      children: [
        new TextRun({
          text: line,
          size: 24
        })
      ],
      spacing: { after: 200 }
    })
  );

  const title = getTitle(lesson.type);

  const doc = new Document({
    sections: [
      {
        children: [

          new Paragraph({
            children: [
              new TextRun({
                text: "MentorAI",
                bold: true,
                size: 40
              })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Platforma AI pentru profesori",
                italics: true
              })
            ],
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Materie: ", bold: true }),
              new TextRun({ text: lesson.subject })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Clasa: ", bold: true }),
              new TextRun({ text: lesson.grade })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Tema: ", bold: true }),
              new TextRun({ text: lesson.topic })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Data generarii: ", bold: true }),
              new TextRun({ text: `${date} ${time}` })
            ],
            spacing: { after: 400 }
          }),

          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          ...contentParagraphs,

          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Document generat automat cu MentorAI.",
                italics: true,
                size: 18
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 }
          })

        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);

  const fileName =
    `mentorai-${lesson.type || "lesson"}-${lesson.subject}-${lesson.topic}-${fileDate}.docx`
      .replace(/\s+/g, "-")
      .toLowerCase();

  saveAs(blob, fileName);
}