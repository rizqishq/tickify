import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
export function signJwt(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}
export function verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
