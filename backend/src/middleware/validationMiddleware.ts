import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod"; // Ubah AnyZodObject menjadi ZodSchema

export const validateBody = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          message: "Invalid input data",
          errors: errorMessages,
        });
      } else {
        next(error);
      }
    }
  };
};
