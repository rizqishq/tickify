export const validateRegister = (data) => {
    if (!data.full_name || data.full_name.length < 3) {
        throw new Error("Full name must be at least 3 characters");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        throw new Error("Invalid email address");
    }
    if (data.phone_number && data.phone_number.length < 8) {
        throw new Error("Phone number too short");
    }
    if (!data.password || data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
    if (data.password !== data.confirm_password) {
        throw new Error("Passwords do not match");
    }
    return data;
};

export const validateLogin = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) {
        throw new Error("Email or Phone number is required");
    }

    if (data.email && !emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
    }

    if (!data.password || data.password.length < 1) {
        throw new Error("Password is required");
    }

    return data;
};
