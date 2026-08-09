/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";



async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { id, data } = await request.json();
  return updateProduct(id, data);
}
