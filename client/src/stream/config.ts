/**
 * Stream configuration. The app talks to the live server.
 * VITE_API_URL overrides the server base (default http://localhost:4000).
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
