import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const bestsellers = await prisma.product.findMany({
        where:{order:{gt: 12}},
        include:{category:true}
    })
    return NextResponse.json(bestsellers);
}