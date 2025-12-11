import { UserRepository } from "../repositories/user.repository.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

export class UserService {
    static async listUsers({ page = 1, limit = 10 } = {}) {
        const offset = (page - 1) * limit;
        return UserRepository.findAll({ limit, offset });
    }

    static async updateProfilePicture(userId, file) {
        if (!file) throw new Error("No file uploaded");

        const url = file.path;

        return UserRepository.updateProfilePicture(userId, url);
    }

    static async removeProfilePicture(userId) {
        return UserRepository.deleteProfilePicture(userId);
    }

    static async updateDetails(userId, data) {
        return UserRepository.updateProfile(userId, data);
    }

    static async getUser(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            created_at: user.created_at,
            profile_picture_url: user.profile_picture_url
        };
    }

    static async changePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            const error = new Error("Current and new password are required");
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const user = await UserRepository.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            const error = new Error("Incorrect current password");
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await UserRepository.updatePassword(userId, hash);
    }

    static async createUser(data) {
        const { password, ...rest } = data;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return UserRepository.create({ ...rest, password_hash: hash });
    }

    static async adminUpdateUser(id, data) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error("User not found");

        let updateData = { ...data };
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password_hash = await bcrypt.hash(data.password, salt);
            delete updateData.password;
        }

        return UserRepository.update(id, updateData);
    }

    static async deleteUser(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw new Error("User not found");
        return UserRepository.delete(id);
    }
}
