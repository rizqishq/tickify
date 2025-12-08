import { pool } from "../src/config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const EVENTS = [
    { title: "Jazz Night", venue: "Blue Note", location: "New York", desc: "Smooth jazz all night." },
    { title: "Rock Fest", venue: "Stadium A", location: "Jakarta", desc: "Rock your socks off." },
    { title: "Tech Conf", venue: "Convention Center", location: "San Francisco", desc: "Latest in tech." },
    { title: "Art Gallery", venue: "City Museum", location: "London", desc: "Modern art exhibition." },
    { title: "Food Festival", venue: "Central Park", location: "New York", desc: "Tapping taste buds." },
    { title: "Comedy Show", venue: "Laugh Factory", location: "Los Angeles", desc: "Laugh until you cry." },
    { title: "Pop Concert", venue: "O2 Arena", location: "London", desc: "Top 40 hits live." },
    { title: "Indie Showcase", venue: "The Basement", location: "Seattle", desc: "Discover new sounds." },
    { title: "Opera Night", venue: "Sydney Opera House", location: "Sydney", desc: "Classic performance." },
    { title: "EDM Blast", venue: "Beach Club", location: "Bali", desc: "Dance until sunrise." }
];

const generateBannerUrl = (title, index) =>
    `https://picsum.photos/seed/${encodeURIComponent(title + "-" + index)}/1200/600`;

async function seed() {
    console.log("Seeding data...");

    try {
        const userRes = await pool.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );
        const organizerId = userRes.rows.length ? userRes.rows[0].id : null;

        for (let i = 0; i < 20; i++) {
            const template = EVENTS[i % EVENTS.length];
            const eventId = uuidv4();

            const bannerUrl = generateBannerUrl(template.title, i + 1);

            await pool.query(
                `
                INSERT INTO events 
                    (id, organizer_id, title, description, location, venue, start_time, end_time, banner_url)
                VALUES 
                    ($1, $2, $3, $4, $5, $6, 
                    NOW() + INTERVAL '${i + 1} days', 
                    NOW() + INTERVAL '${i + 1} days' + INTERVAL '2 hours',
                    $7)
                `,
                [
                    eventId,
                    organizerId,
                    `${template.title} #${i + 1}`,
                    template.desc,
                    template.location,
                    template.venue,
                    bannerUrl
                ]
            );

            await pool.query(
                `
                INSERT INTO ticket_categories (event_id, name, price, quota)
                VALUES 
                    ($1, 'VIP', $2, 50),
                    ($1, 'Regular', $3, 100)
                `,
                [eventId, 100 + i * 10, 50 + i * 5]
            );

            console.log(`Created event: ${template.title} #${i + 1}`);
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Seeding failed", err);
    } finally {
        await pool.end();
    }
}

seed();
