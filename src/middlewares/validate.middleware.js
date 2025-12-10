import { StatusCodes } from "http-status-codes";

/**
 * Middleware adapter for manual validation functions
 * @param {Function} validatorFn - The validation function (throws error if invalid)
 * @param {'body'|'query'|'params'} source - The part of the request to validate (default: body)
 */
export const validate = (validatorFn, source = "body") => (req, res, next) => {
    try {
        const data = req[source];
        const validatedData = validatorFn(data);
        req[source] = validatedData;
        next();
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
            error: "Validation Error",
            details: error.message,
        });
    }
};
