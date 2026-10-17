// Öffentliche Backend-Adresse; leer = gleiche Domain (bzw. Vite-Proxy in der Entwicklung)
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Macht einen Backend-Pfad wie "/media/images/x.webp" absolut zur Backend-Adresse. */
export const mediaUrl = (path) => `${API_URL}${path}`;
