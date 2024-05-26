import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      client_id: string;
    };
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      role: string;
      client_id: string;
    }
  }
}
