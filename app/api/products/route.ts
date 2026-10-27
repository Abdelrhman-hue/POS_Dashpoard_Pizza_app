import { PrismaClient } from "@/lib/generated/prisma/client"; 
import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  const products = await prisma.product.findMany({
    include :{
      category: true
    }
  });
  return NextResponse.json(products);
}


