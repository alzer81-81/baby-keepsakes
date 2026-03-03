import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

import { printSize } from "@/lib/poster-style";

export async function generatePosterPdf(svgMarkup: string, orderId: number): Promise<string> {
  const outputDir = path.join(process.cwd(), "storage", "orders");
  const publicBaseHref = pathToFileURL(path.join(process.cwd(), "public")).href;
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${orderId}.pdf`);

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <base href="${publicBaseHref}/" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700;800&family=Montserrat:wght@400;500;700;800&family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@400;500;700;800&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700;800&family=Fira+Sans:wght@400;500;700;800&family=Libre+Baskerville:wght@400;700&family=Merriweather:wght@400;700;900&family=Poppins:wght@400;500;700;800&family=Quicksand:wght@400;500;700&family=Raleway:wght@400;500;700;800&family=Rubik:wght@400;500;700;800&display=swap');
            html, body {
              margin: 0;
              padding: 0;
              width: ${printSize.widthMm}mm;
              height: ${printSize.heightMm}mm;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
            }
            svg {
              width: ${printSize.widthMm}mm;
              height: ${printSize.heightMm}mm;
              display: block;
            }
          </style>
        </head>
        <body>
          ${svgMarkup}
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({
      path: outputPath,
      width: `${printSize.widthMm}mm`,
      height: `${printSize.heightMm}mm`,
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
    });

    return outputPath;
  } finally {
    await browser.close();
  }
}
