import { qrMatrix, scanCodeFor } from '@/lib/qrV1';

function escapePdf(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function latin(text: string) {
  return text.replace(/[^\x20-\x7E]/g, ' ').slice(0, 120);
}

export function buildScanPdf(input: {
  title: string;
  school?: string;
  educatorName?: string;
  url: string;
  pathId: string;
}) {
  const code = scanCodeFor(input.pathId);
  const matrix = qrMatrix(code);
  const module = 6;
  const originX = 360;
  const originY = 520;
  const squares = matrix.flatMap((row, y) =>
    row.flatMap((on, x) => {
      if (!on) return [];
      const px = originX + x * module;
      const py = originY - y * module;
      return [`${px} ${py} ${module} ${module} re f`];
    })
  );
  const lines = [
    `(${escapePdf(latin(input.title))}) Tj`,
    '0 -22 Td',
    `(Scan card — searchable text PDF) Tj`,
    '0 -18 Td',
    `(School: ${escapePdf(latin(input.school || 'Free / campus copy'))}) Tj`,
    '0 -16 Td',
    `(Educator: ${escapePdf(latin(input.educatorName || 'Campus trainer'))}) Tj`,
    '0 -16 Td',
    `(Scan code: ${escapePdf(code)}) Tj`,
    '0 -16 Td',
    `(Open: ${escapePdf(latin(input.url))}) Tj`,
    '0 -22 Td',
    '(Phone camera: scan the square. Search this PDF for the course title.) Tj',
    '0 -16 Td',
    '(Do not photograph a printed page into a new PDF — that copy is not searchable.) Tj',
  ];
  const content = [
    'BT',
    '/F1 18 Tf',
    '48 760 Td',
    ...lines,
    'ET',
    '0 g',
    ...squares,
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let offset = '%PDF-1.4\n'.length;
  const xref = [0];
  const body = objects
    .map((object, index) => {
      const block = `${index + 1} 0 obj\n${object}\nendobj\n`;
      xref.push(offset);
      offset += block.length;
      return block;
    })
    .join('');
  const xrefTable = [
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...xref.slice(1).map((value) => `${value.toString().padStart(10, '0')} 00000 n `),
  ].join('\n');
  return `%PDF-1.4\n${body}${xrefTable}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;
}

export function downloadText(filename: string, body: string, mime = 'application/pdf') {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
