/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try{
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        basePrice: body.basePrice,

        category: {
          connect: {
            id: body.categoryId,
          },
        },
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}
