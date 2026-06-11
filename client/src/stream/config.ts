/**
 * Stream configuration. Defaults to the live server; set VITE_USE_MOCK=true in
 * an .env to develop against the recorded session offline.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
