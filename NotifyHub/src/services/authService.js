import { logger } from '../logging_middleware/logger';

const API_BASE_URL = 'http://20.207.122.201/evaluation-service';

const CLIENT_ID = '9bab3658-71da-46b7-aef3-f1c10e5f4498';
const CLIENT_SECRET = 'dksjyYNqDEsFjESS';

// Prefer a fresh token from .env.development; fall back to the last known token
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmhpbmF2LjI2MDA5QGdnbmluZGlhLmRyb25hY2hhcnlhLmluZm8iLCJleHAiOjE3Nzc4NzMxMDksImlhdCI6MTc3Nzg3MjIwOSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBmYzBmNzdlLTg2NDAtNDYzNi04N2FiLWZhMjg1ZmEyZTNiYiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGluYXYgdGhha3VyIiwic3ViIjoiOWJhYjM2NTgtNzFkYS00NmI3LWFlZjMtZjFjMTBlNWY0NDk4In0sImVtYWlsIjoiYWJoaW5hdi4yNjAwOUBnZ25pbmRpYS5kcm9uYWNoYXJ5YS5pbmZvIiwibmFtZSI6ImFiaGluYXYgdGhha3VyIiwicm9sbE5vIjoiMjYwMDkiLCJhY2Nlc3NDb2RlIjoidWtzZFdUIiwiY2xpZW50SUQiOiI5YmFiMzY1OC03MWRhLTQ2YjctYWVmMy1mMWMxMGU1ZjQ0OTgiLCJjbGllbnRTZWNyZXQiOiJka3NqeVlOcURFc0ZqRVNTIn0.BVXEPeJYFmT4LiBbC7t4L9iJauQ8YnJ1Iew2wm56TZU';

let authToken = null;

export async function getAuthToken() {
  // Return cached token if already loaded
  if (authToken) {
    return authToken;
  }

  try {
    // Use the provided Bearer token directly
    authToken = `Bearer ${BEARER_TOKEN}`;
    logger.setAuthToken(authToken);
    console.log('[AUTH] Loaded Bearer token successfully');
    return authToken;
  } catch (error) {
    console.error('[AUTH] Failed to load authorization token:', error);
    throw error;
  }
}

export function clearAuthToken() {
  authToken = null;
  tokenExpiry = null;
}
