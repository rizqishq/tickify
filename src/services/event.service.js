import { EventRepository } from "../repositories/event.repository.js";
import { StatusCodes } from "http-status-codes";

export class EventService {
    static async createEvent(data) {
        return EventRepository.create(data);
    }

    static async listEvents(options) {
        return EventRepository.findAll(options);
    }

    static async getEvent(id) {
        const event = await EventRepository.findById(id);
        if (!event) {
            const error = new Error("Event not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        return event;
    }

    static async updateEvent(id, data) {
        await this.getEvent(id);
        return EventRepository.update(id, data);
    }

    static async deleteEvent(id) {
        await this.getEvent(id);
        return EventRepository.delete(id);
    }
}
