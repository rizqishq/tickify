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

    static async findAll({ orderBy = 'created_at', orderDir = 'DESC', limit, offset } = {}) {
        let sql = `SELECT id, full_name, email, phone_number, role, created_at, profile_picture_url FROM users`;

        // Count query
        const countSql = `SELECT COUNT(*) as total FROM users`;
        const { rows: countRows } = await pool.query(countSql);
        const total = parseInt(countRows[0].total);

        // Data query
        sql += ` ORDER BY ${orderBy} ${orderDir}`;

        const params = [];
        let paramIndex = 1;

        if (limit) {
            sql += ` LIMIT $${paramIndex}`;
            params.push(limit);
            paramIndex++;
        }

        if (offset) {
            sql += ` OFFSET $${paramIndex}`;
            params.push(offset);
        }

        const { rows } = await pool.query(sql, params);

        return {
            data: rows,
            pagination: {
                total,
                page: limit ? Math.floor(offset / limit) + 1 : 1,
                limit: limit || total,
                totalPages: limit ? Math.ceil(total / limit) : 1
            }
        };
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

    static async update(id, data) {
        const keys = Object.keys(data).filter(k =>
            ['full_name', 'email', 'phone_number', 'password_hash', 'role'].includes(k)
        );

        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = keys.map(key => data[key]);

        const sql = `
            UPDATE users 
            SET ${setClause}, updated_at = now() 
            WHERE id = $${keys.length + 1}
            RETURNING id, full_name, email, phone_number, role, created_at, profile_picture_url
        `;

        const { rows } = await pool.query(sql, [...values, id]);
        return rows[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id = $1 RETURNING id`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }
}
