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

    static async findAll({ orderBy = 'start_time', orderDir = 'ASC', category } = {}) {
        let sql = `
            SELECT e.*, u.full_name as organizer_name 
            FROM events e 
            LEFT JOIN users u ON e.organizer_id = u.id 
        `;

        const params = [];
        if (category) {
            sql += ` WHERE e.category = $1`;
            params.push(category);
        }

        sql += ` ORDER BY e.${orderBy} ${orderDir}`;

        const { rows } = await pool.query(sql, params);
        return rows;
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
        const { title, description, location, venue, start_time, end_time, banner_url, category } = data;
        const sql = `
            UPDATE events 
            SET title=$1, description=$2, location=$3, venue=$4, start_time=$5, end_time=$6, banner_url=$7, category=$8, updated_at=now()
            WHERE id=$9 
            RETURNING *
        `;
        const { rows } = await pool.query(sql, [title, description, location, venue, start_time, end_time, banner_url, category, id]);
        return rows[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM events WHERE id = $1 RETURNING id`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }
}
