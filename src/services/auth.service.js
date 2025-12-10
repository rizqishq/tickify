import { UserRepository } from "../repositories/user.repository.js";
import { hashPassword, verifyPassword, signJwt } from "../utils/auth.js";
import { StatusCodes } from "http-status-codes";

export class AuthService {
    static async register(data) {
        const { full_name, email, phone_number, password } = data;

        const password_hash = await hashPassword(password);

        try {
            const user = await UserRepository.create({
                full_name,
                email,
                phone_number,
                password_hash,
                role: "user"
            });

            // Sign Token
            const token = signJwt({ id: user.id, email: user.email, role: user.role });
            return { user, token };
        } catch (err) {
            if (err.code === "23505") {
                const error = new Error("Email or Phone number already registered.");
                error.statusCode = StatusCodes.CONFLICT;
                throw error;
            }
            throw err;
        }
    }

    static async login({ email, password }) {
        let user;
        if (email) {
            user = await UserRepository.findByEmail(email);
        }

        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            const error = new Error("Invalid credentials");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const token = signJwt({ id: user.id, email: user.email, role: user.role });

        const userView = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role
        };

        return { user: userView, token };
    }
}
