import { pool } from "../config/db.js";

export class EventRepository {
    static async create(data) {
        const { organizer_id, title, description, location, venue, start_time, end_time, banner_url } = data;
        const sql = `
            INSERT INTO events (organizer_id, title, description, location, venue, start_time, end_time, banner_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const { rows } = await pool.query(sql, [organizer_id, title, description, location, venue, start_time, end_time, banner_url]);
        return rows[0];
    }

    static async findAll({ orderBy = 'start_time', orderDir = 'ASC' } = {}) {
        const sql = `SELECT * FROM events ORDER BY ${orderBy} ${orderDir}`;
        const { rows } = await pool.query(sql);
        return rows;
    }

    static async findById(id) {
        const sql = `SELECT * FROM events WHERE id = $1`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const { title, description, location, venue, start_time, end_time, banner_url } = data;
        const sql = `
            UPDATE events 
            SET title=$1, description=$2, location=$3, venue=$4, start_time=$5, end_time=$6, banner_url=$7, updated_at=now()
            WHERE id=$8 
            RETURNING *
        `;
        const { rows } = await pool.query(sql, [title, description, location, venue, start_time, end_time, banner_url, id]);
        return rows[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM events WHERE id = $1 RETURNING id`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }
}
