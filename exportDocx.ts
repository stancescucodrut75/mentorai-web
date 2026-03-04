import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel
} from "docx";

import { saveAs } from "file-saver";

export async function exportLessonDOCX(lesson: any) {

  const now = new Date();

  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const fileDate = now.toISOString().replace(/[:.]/g, "-");

  const lines: string[] = lesson.content.split("\n");

const contentParagraphs = lines.map((line: string, _i: number): Paragraph =>
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
                text: "Generator inteligent de planuri de lectie",
                italics: true
              })
            ],
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Materie: `, bold: true }),
              new TextRun({ text: lesson.subject })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Clasa: `, bold: true }),
              new TextRun({ text: lesson.grade })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Tema: `, bold: true }),
              new TextRun({ text: lesson.topic })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Data generarii: `, bold: true }),
              new TextRun({ text: `${date} ${time}` })
            ],
            spacing: { after: 400 }
          }),

          new Paragraph({
            text: "PLAN DE LECTIE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          ...contentParagraphs,

          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Document generat automat cu MentorAI. Utilizarea in afara aplicatiei MentorAI nu este permisa fara acordul platformei.",
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
    `MentorAI-${lesson.subject}-clasa-${lesson.grade}-${lesson.topic}-${fileDate}.docx`
      .replace(/\s+/g, "-")
      .toLowerCase();

  saveAs(blob, fileName);
}