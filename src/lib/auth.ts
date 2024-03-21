
import { db } from "@/server/db";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    // This is a temporary fix for prisma client.
    // @see https://github.com/prisma/prisma/issues/16117
    adapter: PrismaAdapter(db as any),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            id: "credentials",
            credentials: {
                walletAddress: { label: "WalletAddress", type: "text" },
            },
            async authorize(credentials) {
                // if (!isValidWalletAddress(credentials?.walletAddress as string))
                //     return null
                return {
                    id: credentials?.walletAddress as string,
                    walletAddress: credentials?.walletAddress,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    walletAddress: token.walletAddress,
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    walletAddress: u.walletAddress,
                };
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};