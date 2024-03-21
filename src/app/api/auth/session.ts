import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "You are not logged in" }),
            { status: 401 }
        );
    }

    return NextResponse.json({
        authenticated: !!session,
        session,
    });
}

export { handler as GET };
