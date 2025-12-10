import { EventService } from "../../services/event.service.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";

export const adminCreateEvent = asyncWrapper(async (req, res) => {
    // req.user comes from auth middleware (assumed to be there)
    let eventData = { ...req.body, organizer_id: req.user.id };

    if (req.file) {
        eventData.banner_url = req.file.path;
    }

    const event = await EventService.createEvent(eventData);
    res.status(StatusCodes.CREATED).json(event);
});

export const adminListEvents = asyncWrapper(async (req, res) => {
    const events = await EventService.listEvents({ orderBy: 'start_time', orderDir: 'DESC' });
    res.json(events);
});



export const adminUpdateEvent = asyncWrapper(async (req, res) => {
    let eventData = { ...req.body };

    if (req.file) {
        eventData.banner_url = req.file.path;
    }

    const event = await EventService.updateEvent(req.params.id, eventData);
    res.json(event);
});

export const adminDeleteEvent = asyncWrapper(async (req, res) => {
    await EventService.deleteEvent(req.params.id);
    res.json({ message: "Event deleted successfully" });
});
