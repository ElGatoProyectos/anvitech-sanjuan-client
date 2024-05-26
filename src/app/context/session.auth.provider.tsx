"use client";

import { SessionProvider, type SessionProviderProps } from "next-auth/react";

export const NextAuthProvider = (props: SessionProviderProps) => {
  return <SessionProvider {...props} />;
};
