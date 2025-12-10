import { pool } from "../config/db.js";

export class OrderRepository {
    static async create({ user_id, total_price, status = 'pending' }, client = pool) {
        const sql = `INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *`;
        const { rows } = await client.query(sql, [user_id, total_price, status]);
        return rows[0];
    }

    static async createItem({ order_id, category_id, quantity, price_each, subtotal }, client = pool) {
        const sql = `
            INSERT INTO order_items (order_id, category_id, quantity, price_each, subtotal)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await client.query(sql, [order_id, category_id, quantity, price_each, subtotal]);
        return rows[0];
    }

    static async findByUserId(userId, status) {
        let sql = `
            SELECT o.*, 
            coalesce(json_agg(json_build_object(
              'id', oi.id,
              'category_id', oi.category_id,
              'quantity', oi.quantity,
              'price_each', oi.price_each,
              'subtotal', oi.subtotal
            )) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = $1
        `;
        const params = [userId];

        if (status) {
            sql += " AND o.status = $2";
            params.push(status);
        }

        sql += " GROUP BY o.id ORDER BY o.created_at DESC";
        const { rows } = await pool.query(sql, params);
        return rows;
    }

    static async updateStatus(id, status, client = pool) {
        const sql = `UPDATE orders SET status = $1, paid_at = now() WHERE id = $2 RETURNING *`;
        const { rows } = await client.query(sql, [status, id]);
        return rows[0];
    }

    static async findById(id) {
        const sql = `
            SELECT o.*, 
            coalesce(json_agg(json_build_object(
              'id', oi.id,
              'category_id', oi.category_id,
              'quantity', oi.quantity,
              'price_each', oi.price_each,
              'subtotal', oi.subtotal,
              'category_name', tc.name,
              'event_title', e.title,
              'event_id', e.id
            )) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN ticket_categories tc ON oi.category_id = tc.id
            LEFT JOIN events e ON tc.event_id = e.id
            WHERE o.id = $1
            GROUP BY o.id
        `;
        const { rows } = await pool.query(sql, [id]);
        return rows[0];
    }
}
