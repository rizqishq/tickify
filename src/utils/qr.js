import QRCode from "qrcode";

export function generateTicketCode() {
    return 'TCK-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function generateQrDataUri(text) {
    return await QRCode.toDataURL(text);
}
