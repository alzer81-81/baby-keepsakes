import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const orderId = Number(params.id);

  if (!orderId || Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order?.pdfPath) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const resolvedPath = path.resolve(order.pdfPath);
  const bytes = await readFile(resolvedPath);

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="order-${orderId}.pdf"`
    }
  });
}
