/**
 * API Configuration for UrbanPulse Nexus Frontend.
 * Supports Vite environment variable VITE_API_URL.
 * Fallbacks:
 * - Production: https://urbanpulse-nexus-1.onrender.com
 * - Development: http://localhost:5000 (if VITE_API_URL is not provided)
 */

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  return 'https://urbanpulse-nexus-1.onrender.com';
};

export const BASE_URL = getApiBaseUrl();
export const API_BASE_URL = `${BASE_URL}/api`;
