import { authService } from "@/lib/core/service/auth.service";

export async function authenticate(data: {
  username: string;
  password: string;
}) {
  const response = await authService.login(data);

  if (response.ok) {
    const user = {
      id: response.content.id,
      role: response.content.role,
      client_id: response.content.company ? response.content.company : "",
    };

    return user;
  } else return null;
}
