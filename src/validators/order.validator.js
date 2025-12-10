export const validateCreateOrder = (data) => {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("At least one item required");
    }

    for (const item of data.items) {
        if (!item.category_id) {
            throw new Error("Invalid category ID");
        }
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }
    }

    return data;
};
