import { pool } from "../config/db.js";

export class EventRepository {
    static async create(data) {
        const { organizer_id, title, description, location, venue, start_time, end_time, banner_url, category } = data;
        const sql = `
            INSERT INTO events (organizer_id, title, description, location, venue, start_time, end_time, banner_url, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const { rows } = await pool.query(sql, [organizer_id, title, description, location, venue, start_time, end_time, banner_url, category]);
        return rows[0];
    }

    static async findAll({ orderBy = 'start_time', orderDir = 'ASC', category, limit, offset } = {}) {
        let sql = `
            SELECT e.*, u.full_name as organizer_name 
            FROM events e 
            LEFT JOIN users u ON e.organizer_id = u.id 
        `;

        const params = [];
        let paramIndex = 1;

        if (category) {
            sql += ` WHERE e.category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        // Count total query
        const countSql = `SELECT COUNT(*) as total FROM events e ${category ? `WHERE e.category = $1` : ''}`;
        const countParams = category ? [category] : [];
        const { rows: countRows } = await pool.query(countSql, countParams);
        const total = parseInt(countRows[0].total);

        // Data query
        sql += ` ORDER BY e.${orderBy} ${orderDir}`;

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

    static async findById(id) {
        const sql = `
            SELECT e.*, u.full_name as organizer_name 
            FROM events e 
            LEFT JOIN users u ON e.organizer_id = u.id 
            WHERE e.id = $1
        `;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const keys = Object.keys(data).filter(k =>
            ['title', 'description', 'location', 'venue', 'start_time', 'end_time', 'banner_url', 'category'].includes(k)
        );

        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = keys.map(key => data[key]);

        const sql = `
            UPDATE events 
            SET ${setClause}, updated_at = now()
            WHERE id = $${keys.length + 1}
            RETURNING *
        `;

        const { rows } = await pool.query(sql, [...values, id]);
        return rows[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM events WHERE id = $1 RETURNING id`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }
}
