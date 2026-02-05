export const TRIBE_DICTIONARY = {
    // User Roles
    CITIZEN: "Citizen",
    PLUG: "The Plug",

    // Core Concepts
    MARKETPLACE: "Marketplace",
    STORE: "Hustle HQ",
    PRODUCT: "The Drop",
    ESCROW: "TribeGuard Shield",
    COMMISSION: "Tribe Council Fee",

    // Statuses
    PENDING: "Incoming...",
    DELIVERED: "Shipped",
    RECEIVED: "At the Base",
    RELEASED: "Hustle Paid",
    LOCKED: "Shield Active",

    // UI Elements
    DASHBOARD: "Hustle HQ Dashboard",
    WALLET: "Hustle Bag",
    ESCROW_BALANCE: "TribeGuard Balance",
    VERIFIED_BADGE: "GreenCheck Official"
};

export const mapTerm = (key) => TRIBE_DICTIONARY[key] || key;
