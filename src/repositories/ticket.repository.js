import { pool } from "../config/db.js";

export class TicketRepository {
    static async create({ order_item_id, user_id, category_id, ticket_code }, client = pool) {
        const sql = `
            INSERT INTO tickets (order_item_id, user_id, category_id, ticket_code) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const { rows } = await client.query(sql, [order_item_id, user_id, category_id, ticket_code]);
        return rows[0];
    }

    static async findById(id) {
        const sql = `
            SELECT t.*, tc.name as category_name, tc.price, e.title as event_title, e.start_time, e.end_time, e.venue, e.location
            FROM tickets t
            JOIN ticket_categories tc ON t.category_id = tc.id
            JOIN events e ON tc.event_id = e.id
            WHERE t.id = $1
        `;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT t.*, tc.name as category_name, e.title as event_title, e.start_time, e.venue, e.id as event_id
            FROM tickets t
            JOIN ticket_categories tc ON t.category_id = tc.id
            JOIN events e ON tc.event_id = e.id
            JOIN order_items oi ON t.order_item_id = oi.id
            JOIN orders o ON oi.order_id = o.id
            WHERE t.user_id = $1 AND o.status = 'paid'
            ORDER BY t.created_at DESC
        `;
        const { rows } = await pool.query(sql, [userId]);
        return rows;
    }

    static async findByEventId(eventId) {
        return [];
    }
};
