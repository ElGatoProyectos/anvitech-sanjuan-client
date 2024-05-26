import { ZodError } from "zod";
import { httpResponse } from "./response.service";

class ErrorService {
  handleErrorSchema(error: any) {
    if (error instanceof ZodError) {
      const validationErrors = error.errors;
      return httpResponse.http400(
        "Error in validation schema",
        validationErrors
      );
    } else {
      return httpResponse.http404("Error in server");
    }
  }
}

export const errorService = new ErrorService();
