import { verifyJwt } from "../utils/auth.js";

export function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token provided" });
    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Token error" });
    const token = parts[1];
    try {
        const decoded = verifyJwt(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}