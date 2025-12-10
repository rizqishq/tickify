import { pool } from "../src/config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const EVENTS = [
    { title: "Jazz Night", venue: "Blue Note", location: "New York", desc: "Smooth jazz all night.", category: "music" },
    { title: "Rock Fest", venue: "Stadium A", location: "Jakarta", desc: "Rock your socks off.", category: "music" },
    { title: "Tech Conf", venue: "Convention Center", location: "San Francisco", desc: "Latest in tech.", category: "talkshow" },
    { title: "Art Gallery", venue: "City Museum", location: "London", desc: "Modern art exhibition.", category: "exhibition" },
    { title: "Food Festival", venue: "Central Park", location: "New York", desc: "Tapping taste buds.", category: "exhibition" },
    { title: "Comedy Show", venue: "Laugh Factory", location: "Los Angeles", desc: "Laugh until you cry.", category: "theater" },
    { title: "Marathon 5K", venue: "City Park", location: "Boston", desc: "Run for charity.", category: "sports" },
    { title: "Coding Bootcamp", venue: "Tech Hub", location: "Austin", desc: "Learn React in a day.", category: "workshop" },
    { title: "E-Sport Championship", venue: "Arena X", location: "Seoul", desc: "Global gaming battle.", category: "competition" },
    { title: "Design Talk", venue: "Creative Space", location: "Berlin", desc: "Future of design.", category: "talkshow" }
];

const generateBannerUrl = (title, index) =>
    `https://picsum.photos/seed/${encodeURIComponent(title + "-" + index)}/1200/600`;

async function seed() {
    console.log("Seeding data...");

    try {
        const userRes = await pool.query("SELECT id FROM users");
        if (userRes.rows.length === 0) {
            console.error("No users found. Please seed users first.");
            process.exit(1);
        }
        const users = userRes.rows;

        for (let i = 0; i < 50; i++) {
            const template = EVENTS[i % EVENTS.length];
            const eventId = uuidv4();

            const randomUser = users[Math.floor(Math.random() * users.length)];
            const organizerId = randomUser.id;

            const bannerUrl = generateBannerUrl(template.title, i + 1);

            await pool.query(
                `
                INSERT INTO events 
                    (id, organizer_id, title, description, location, venue, start_time, end_time, banner_url, category)
                VALUES 
                    ($1, $2, $3, $4, $5, $6, 
                    NOW() + INTERVAL '${i + 1} days', 
                    NOW() + INTERVAL '${i + 1} days' + INTERVAL '2 hours',
                    $7, $8)
                `,
                [
                    eventId,
                    organizerId,
                    `${template.title} #${i + 1}`,
                    template.desc,
                    template.location,
                    template.venue,
                    bannerUrl,
                    template.category
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

            console.log(`Created event: ${template.title} #${i + 1} (Organizer: ${organizerId})`);
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Seeding failed", err);
    } finally {
        await pool.end();
    }
}

seed();
