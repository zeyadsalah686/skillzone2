import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": "Basic" },
        });
    }
}

async function isAuthenticated(req: NextRequest) {
    const authHeader =
        req.headers.get("authorization") || req.headers.get("Authorization");

    if (authHeader == null) return false;

    const [type, credentials] = authHeader.split(" ");
    if (type !== "Basic") return false;

    const [username, password] = Buffer.from(credentials, "base64")
        .toString()
        .split(":");

    return (
        username === process.env.ADMIN_USERNAME &&
        (await isValidPassword(
            password,
            process.env.HASHED_ADMIN_PASSWORD as string
        ))
    );
}

export const config = {
    matcher: "/admin/:path*",
};
