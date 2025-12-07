/**
 * Wraps async route handlers to catch errors automatically.
 * @param {Function} fn - The async controller function
 */
export const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
