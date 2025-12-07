import { StatusCodes } from "http-status-codes";
import { z } from "zod";

/**
 * Middleware adapter for Zod validation
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {'body'|'query'|'params'} source - The part of the request to validate (default: body)
 */
export const validate = (schema, source = "body") => (req, res, next) => {
    try {
        const data = req[source];
        const parsed = schema.parse(data);
        req[source] = parsed; // Replace with parsed (clean) data
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {

            const zodErrors = error.errors || [];
            if (zodErrors.length > 0) {
                const errors = zodErrors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: "Validation Error",
                    details: errors,
                });
            }
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message || "Invalid input"
            });
        }
        next(error);
    }
};
