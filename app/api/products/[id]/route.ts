import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";




export async function GET(request: Request,
  { params }: { params: Promise<{ id: string }> }) {
    try{
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

      if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Product deleted successfully",
  });
}