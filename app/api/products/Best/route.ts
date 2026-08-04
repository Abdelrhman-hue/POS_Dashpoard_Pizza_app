import { PrismaClient } from "@/lib/generated/prisma/client"; 
import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET(request: Request) {
    const bestsellers = await prisma.product.findMany({
        where:{order:{gt: 12}},
        include:{category:true}
    })
    return NextResponse.json(bestsellers);
}