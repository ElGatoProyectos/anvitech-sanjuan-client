import { authService } from "@/lib/core/service/auth.service";
import { userService } from "@/lib/core/service/user.service";

export async function authenticate(data: {
  username: string;
  password: string;
}) {
  const res = await userService.findAll();
  console.log(res);
  const response = await authService.login(data);

  console.log(response);
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
