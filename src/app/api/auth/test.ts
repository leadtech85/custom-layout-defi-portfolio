import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(request: Request) {

    return NextResponse.json({
        authenticated: 'Hello test',
    });
}

export { handler as GET };
