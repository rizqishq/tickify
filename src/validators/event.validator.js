export const validateCreateEvent = (data) => {
    if (!data.title || data.title.length < 5) {
        throw new Error("Title must be at least 5 chars");
    }
    if (!data.start_time) {
        throw new Error("Start time is required");
    }

    // Coerce dates
    const start = new Date(data.start_time);
    if (isNaN(start.getTime())) {
        throw new Error("Invalid start_time");
    }
    data.start_time = start;

    if (data.end_time) {
        const end = new Date(data.end_time);
        if (isNaN(end.getTime())) {
            throw new Error("Invalid end_time");
        }
        data.end_time = end;
    }

    return data;
};

export const validateUpdateEvent = (data) => {
    // Partial validation for update
    if (data.title && data.title.length < 5) {
        throw new Error("Title must be at least 5 chars");
    }
    if (data.start_time) {
        const start = new Date(data.start_time);
        if (isNaN(start.getTime())) throw new Error("Invalid start_time");
        data.start_time = start;
    }
    if (data.end_time) {
        const end = new Date(data.end_time);
        if (isNaN(end.getTime())) throw new Error("Invalid end_time");
        data.end_time = end;
    }
    return data;
};
