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
      username: response.content.username,
    };

    return user;
  } else {
    return null;
  }
}
