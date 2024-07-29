import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: { params: { downloadVerificationId: string } }
) {
    const data = await db.downloadVerification.findUnique({
        where: {
            id: downloadVerificationId,
            expiresAt: { gt: new Date() },
        },
        select: {
            product: {
                select: {
                    filePath: true,
                    name: true,
                },
            },
        },
    });

    if (data == null) {
        return NextResponse.redirect(new URL("/products/download/expired", req.url));
    }

    const filePath = data.product.filePath;
    const { size } = await fs.stat(filePath);
    const file = await fs.readFile(filePath);

    const extension = path.extname(filePath).slice(1);

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-Length": size.toString(),
        },
    });
}
