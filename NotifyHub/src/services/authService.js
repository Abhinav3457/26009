const API_BASE_URL = 'http://20.207.122.201/evaluation-service';

const CLIENT_ID = '9bab3658-71da-46b7-aef3-f1c10e5f4498';
const CLIENT_SECRET = 'dksjyYNqDEsFjESS';

let authToken = null;
let tokenExpiry = null;

export async function getAuthToken() {
  // Return cached token if still valid
  if (authToken && tokenExpiry && new Date() < tokenExpiry) {
    return authToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();
    authToken = data.token_type 
      ? `${data.token_type} ${data.access_token}` 
      : data.access_token;
    
    // Token expires in 1 hour, refresh 5 minutes before
    tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
    
    console.log('[AUTH] Successfully obtained authorization token');
    return authToken;
  } catch (error) {
    console.error('[AUTH] Failed to get authorization token:', error);
    throw error;
  }
}

export function clearAuthToken() {
  authToken = null;
  tokenExpiry = null;
}
