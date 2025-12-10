import { pool } from "../config/db.js";

export class TicketCategoryRepository {
    static async create({ event_id, name, price, quota }) {
        const sql = `INSERT INTO ticket_categories (event_id, name, price, quota) VALUES ($1,$2,$3,$4) RETURNING *`;
        const { rows } = await pool.query(sql, [event_id, name, price, quota]);
        return rows[0];
    }

    static async findByIdForUpdate(id, client = pool) {
        const sql = `SELECT id, price, quota, sold FROM ticket_categories WHERE id=$1 FOR UPDATE`;
        const { rows } = await client.query(sql, [id]);
        return rows[0];
    }

    static async findById(id) {
        const sql = `SELECT * FROM ticket_categories WHERE id=$1`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async findByEventId(eventId) {
        const sql = `SELECT * FROM ticket_categories WHERE event_id = $1`;
        const { rows } = await pool.query(sql, [eventId]);
        return rows;
    }

    static async update(id, data) {
        const keys = Object.keys(data).filter(k => ['name', 'price', 'quota'].includes(k));
        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = keys.map(key => data[key]);

        const sql = `UPDATE ticket_categories SET ${setClause}, updated_at=now() WHERE id=$${keys.length + 1} RETURNING *`;
        const { rows } = await pool.query(sql, [...values, id]);
        return rows[0];
    }

    static async updateQuota(id, quantity, client = pool) {
        // quota = quota - quantity, sold = sold + quantity
        const sql = `UPDATE ticket_categories SET quota = quota - $1, sold = sold + $1 WHERE id=$2`;
        await client.query(sql, [quantity, id]);
    }

    static async delete(id) {
        await pool.query("DELETE FROM ticket_categories WHERE id=$1", [id]);
    }
}
