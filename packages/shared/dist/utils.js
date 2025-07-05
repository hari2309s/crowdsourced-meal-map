"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatDistance = formatDistance;
exports.formatOperatingHours = formatOperatingHours;
exports.getStatusColor = getStatusColor;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
}
function formatOperatingHours(hours) {
    if (!hours)
        return "Hours not specified";
    const today = new Date()
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();
    const todayHours = hours[today];
    if (!todayHours)
        return "Closed today";
    return `${todayHours.open} - ${todayHours.close}`;
}
function getStatusColor(status) {
    switch (status) {
        case "available":
            return "text-green-600 bg-green-50";
        case "limited":
            return "text-yellow-600 bg-yellow-50";
        case "unavailable":
            return "text-red-600 bg-red-50";
        default:
            return "text-gray-600 bg-gray-50";
    }
}
//# sourceMappingURL=utils.js.map