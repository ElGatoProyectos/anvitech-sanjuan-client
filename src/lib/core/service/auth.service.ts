import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";
import { userService } from "./user.service";
import bcrypt from "bcrypt";

class AuthService {
  async login(data: { username: string; password: string }) {
    try {
      const responseUser = await userService.findUserByUsername(data.username);
      if (!responseUser.ok) return responseUser;
      if (bcrypt.compareSync(data.password, responseUser.content.password))
        return httpResponse.http200("Login correct", responseUser.content);
      return httpResponse.http401("Error in Auth", {
        message: "Error in auth",
      });
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async validationAdmin(session: any) {
    try {
      const { user } = session;

      if (user.role === "admin") {
        return httpResponse.http200("Authentication ok", null);
      } else return httpResponse.http401("Error in authentication");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }

  async validationUser(session: any) {
    try {
      const { user } = session;

      if (user.role === "user" || user.role === "admin") {
        return httpResponse.http200("Authentication ok");
      } else return httpResponse.http401("Error in authentication");
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const authService = new AuthService();
