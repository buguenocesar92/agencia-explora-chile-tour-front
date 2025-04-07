/**
 * URL base de la API
 * En desarrollo, esta debería apuntar a localhost o a la API de desarrollo
 * En producción, debería apuntar a la URL de la API en producción
 */
export const API_URL = process.env.API_URL || 'http://localhost:8000/api';

/**
 * Otras constantes globales de la aplicación
 */
export const MAX_CLIENTS_PER_RESERVATION = 10;
export const DEFAULT_CURRENCY = 'CLP';
export const DEFAULT_LANGUAGE = 'es';

/**
 * Configuración de timeouts para peticiones
 */
export const API_TIMEOUT = 30000; // 30 segundos 