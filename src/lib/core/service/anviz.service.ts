import axios from "axios";
import { errorService } from "./errors.service";
import { httpResponse } from "./response.service";

class AnvizService {
  async getToken() {
    try {
      const token = axios.post("", {
        header: {
          nameSpace: "authorize.token",
          nameAction: "token",
          version: "1.0",
          requestId: "f1becc28-ad01-b5b2-7cef-392eb1526f39",
          timestamp: "2022-10-21T07:39:07+00:00",
        },
        payload: {
          api_key: process.env.CROSSCHEXCLOUD_API_KEY,
          api_secret: process.env.CROSSCHEXCLOUD_API_SECRET,
        },
      });
      return httpResponse.http200("Fetch ok!", { token });
    } catch (error) {
      return errorService.handleErrorSchema(error);
    }
  }
}

export const anvizService = new AnvizService();
