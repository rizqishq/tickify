import { pool } from "../config/db.js";

export class UserRepository {
    static async create({ full_name, email, phone_number, password_hash, role = 'user' }) {
        const sql = `
            INSERT INTO users (full_name, email, phone_number, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, full_name, email, phone_number, role, created_at
        `;
        const { rows } = await pool.query(sql, [full_name, email || null, phone_number || null, password_hash, role]);
        return rows[0];
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await pool.query(sql, [email]);
        return rows[0];
    }

    static async findByPhone(phoneNumber) {
        const sql = `SELECT * FROM users WHERE phone_number = $1`;
        const { rows } = await pool.query(sql, [phoneNumber]);
        return rows[0];
    }

    static async findById(id) {
        const sql = `SELECT * FROM users WHERE id = $1`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async findAll({ orderBy = 'created_at', orderDir = 'DESC' } = {}) {
        const sql = `SELECT id, full_name, email, phone_number, role, created_at, profile_picture_url FROM users ORDER BY ${orderBy} ${orderDir}`;
        const { rows } = await pool.query(sql);
        return rows;
    }

    static async updateProfilePicture(id, url) {
        const sql = `UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING id, profile_picture_url`;
        const { rows } = await pool.query(sql, [url, id]);
        return rows[0];
    }

    static async deleteProfilePicture(id) {
        const sql = `UPDATE users SET profile_picture_url = NULL WHERE id = $1 RETURNING id`;
        await pool.query(sql, [id]);
    }

    static async updateProfile(id, { full_name, email, phone_number }) {
        // Dynamic update could be better, but fixed columns is simpler for now
        const sql = `
            UPDATE users 
            SET full_name = COALESCE($1, full_name), 
                email = COALESCE($2, email), 
                phone_number = COALESCE($3, phone_number),
                updated_at = now()
            WHERE id = $4 
            RETURNING id, full_name, email, phone_number, role, profile_picture_url
        `;
        const { rows } = await pool.query(sql, [full_name, email, phone_number, id]);
        return rows[0];
    }

    static async updatePassword(id, passwordHash) {
        const sql = `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`;
        await pool.query(sql, [passwordHash, id]);
    }
}
