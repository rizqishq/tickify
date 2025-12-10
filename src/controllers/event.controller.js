import { EventService } from "../services/event.service.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const listEvents = asyncWrapper(async (req, res) => {
    const { category, page, limit } = req.query;
    const events = await EventService.listEvents({
        orderBy: 'start_time',
        orderDir: 'ASC',
        category,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 6
    });
    res.json(events);
});

export const getEvent = asyncWrapper(async (req, res) => {
    const event = await EventService.getEvent(req.params.id);
    res.json(event);
});
