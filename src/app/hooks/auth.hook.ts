import { authService } from "@/lib/core/service/auth.service";
import { userService } from "@/lib/core/service/user.service";
import axios from "axios";

export async function authenticate(data: {
  username: string;
  password: string;
}) {

  try {
    const response: any = await axios.post(
      "http://localhost:4000/api/auth",
      data
    );


    const user = {
      id: response.data.id,
      role: response.data.role,
      username: response.data.username,
    };

    return user;
  } catch (error) {
    return null;
  }
}
