"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod"); // Ubah AnyZodObject menjadi ZodSchema
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                res.status(400).json({
                    message: "Invalid input data",
                    errors: errorMessages,
                });
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateBody = validateBody;
