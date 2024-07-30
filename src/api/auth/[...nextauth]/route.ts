import { authenticate } from "@/app/hooks/auth.hook";
import { authOptions } from "@/lib/auth-options";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
