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

    static async findByUserId(userId, limit, offset) {
        let sql = `
            SELECT t.*, tc.name as category_name, e.title as event_title, e.start_time, e.venue, e.id as event_id, o.id as order_id
            FROM tickets t
            JOIN ticket_categories tc ON t.category_id = tc.id
            JOIN events e ON tc.event_id = e.id
            JOIN order_items oi ON t.order_item_id = oi.id
            JOIN orders o ON oi.order_id = o.id
            WHERE t.user_id = $1 AND o.status = 'paid'
        `;

        // Count total
        const countSql = `
            SELECT COUNT(*) as total
            FROM tickets t
            JOIN order_items oi ON t.order_item_id = oi.id
            JOIN orders o ON oi.order_id = o.id
            WHERE t.user_id = $1 AND o.status = 'paid'
        `;
        const { rows: countRows } = await pool.query(countSql, [userId]);
        const total = parseInt(countRows[0].total);

        // Data query
        sql += ` ORDER BY t.created_at DESC`;

        const params = [userId];
        if (limit) {
            sql += ` LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
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

    static async findByEventId(eventId) {
        return [];
    }
};
