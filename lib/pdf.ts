import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { printSize } from "@/lib/poster-style";

function mmToPoints(mm: number): number {
  return (mm / 25.4) * 72;
}

async function renderSvgToPdfBuffer(svgMarkup: string): Promise<Buffer> {
  const pdfkitModuleName = "pdfkit";
  const svgToPdfModuleName = "svg-to-pdfkit";

  const [pdfkitModule, svgToPdfModule] = await Promise.all([import(pdfkitModuleName), import(svgToPdfModuleName)]);

  const PDFDocumentCtor = (pdfkitModule as unknown as { default?: new (...args: unknown[]) => any }).default ?? (pdfkitModule as any);
  const SVGtoPDF = (svgToPdfModule as unknown as { default?: (...args: unknown[]) => void }).default ?? (svgToPdfModule as any);

  const width = mmToPoints(printSize.widthMm);
  const height = mmToPoints(printSize.heightMm);

  const doc = new PDFDocumentCtor({
    autoFirstPage: false,
    compress: true,
    size: [width, height],
    margins: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  doc.addPage({ size: [width, height], margins: { top: 0, right: 0, bottom: 0, left: 0 } });

  const chunks: Buffer[] = [];
  const pdfDone = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (error: Error) => reject(error));
  });

  SVGtoPDF(doc, svgMarkup, 0, 0, {
    width,
    height,
    preserveAspectRatio: "xMidYMid meet"
  });

  doc.end();
  return pdfDone;
}

export async function generatePosterPdfBuffer(svgMarkup: string): Promise<Buffer> {
  return renderSvgToPdfBuffer(svgMarkup);
}

export async function generatePosterPdf(svgMarkup: string, orderId: number): Promise<string> {
  const outputDir = process.env.VERCEL ? path.join("/tmp", "orders") : path.join(process.cwd(), "storage", "orders");
  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${orderId}.pdf`);
  const pdfBuffer = await renderSvgToPdfBuffer(svgMarkup);
  await writeFile(outputPath, pdfBuffer);

  return outputPath;
}
