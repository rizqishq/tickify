import { pool } from "../src/config/db.js";

async function testConnection() {
    try {
        console.log("Testing database connection...");
        const res = await pool.query('SELECT NOW()');
        console.log("Connection successful!", res.rows[0]);
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
