/**
 * RasaanGo — Environment Configuration
 * Change API_BASE_URL to point to your backend server.
 */

const IS_DEV = __DEV__;

export const ENV = {
    API_BASE_URL: IS_DEV
        ? 'http://localhost:3000/api'
        : 'https://api.rasaango.com/api',

    WS_URL: IS_DEV
        ? 'ws://localhost:3000'
        : 'wss://api.rasaango.com',

    /** Feature flags */
    FORCE_MOCK: true, // Prevents real HTTP requests, keeping console clean
    WHATSAPP_API_ENABLED: !IS_DEV,
    PUSH_NOTIFICATIONS_ENABLED: true,
    LOCATION_TRACKING_ENABLED: true,

    /** Timeouts */
    API_TIMEOUT: 15000,
    ORDER_POLL_INTERVAL: 10000,

    /** App info */
    APP_VERSION: '1.0.0',
    IS_DEV,
};
