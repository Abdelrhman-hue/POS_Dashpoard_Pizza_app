/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
      const { searchParams } = new URL(request.url);
 const categoryId = searchParams.get("categoryId");

  try {
    const products = await prisma.product.findMany({
       where: categoryId
    ? {
        categoryId,
      }
    : {},
      include: {
        category: true,
      }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 });
  }
}
