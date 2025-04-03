// Simulated password hashing with a secure algorithm
// In a real app, you would use bcrypt or Argon2
export async function hashPassword(password: string): Promise<string> {
  // In a production environment, use a proper crypto library
  // This is just for demonstration purposes
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(password + '_salt_value')
      )
    )
  )
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify password against hashed version
export async function verifyPassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  const hashedInput = await hashPassword(plainPassword);
  return hashedInput === hashedPassword;
}

// Generate a session token
export function generateToken(): string {
  // In a real app, use a proper JWT library
  return `token_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

// Session constants
const SESSION_STORAGE_KEY = 'user_sessions';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SESSION_ACTIVITY_KEY = 'last_activity';

// Update session activity timestamp
export function updateSessionActivity(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
}

// Get all sessions
export function getSessions(): Record<string, any> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}');
  } catch (error) {
    console.error('Error getting sessions:', error);
    return {};
  }
}

// Save sessions
export function saveSessions(sessions: Record<string, any>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
}

// Create a session for a user
export function createSession(userId: string): string {
  const token = generateToken();
  
  if (typeof window !== 'undefined') {
    // Store the session token and user ID in localStorage
    const sessions = getSessions();
    sessions[token] = {
      userId,
      expiresAt: Date.now() + SESSION_DURATION,
      createdAt: Date.now(),
    };
    saveSessions(sessions);
    
    // Update last activity timestamp
    updateSessionActivity();
  }
  return token;
}

// Verify a session token
export function verifySession(token: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const sessions = getSessions();
    const session = sessions[token];
    
    if (!session) {
      return null;
    }
    
    if (session.expiresAt < Date.now()) {
      // Session expired
      delete sessions[token];
      saveSessions(sessions);
      return null;
    }
    
    // Extend session duration on verification
    sessions[token].expiresAt = Date.now() + SESSION_DURATION;
    saveSessions(sessions);
    
    // Update last activity timestamp
    updateSessionActivity();
    
    return session.userId;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

// Remove a session
export function removeSession(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const sessions = getSessions();
    delete sessions[token];
    saveSessions(sessions);
  } catch (error) {
    console.error('Error removing session:', error);
  }
}

// Remove all expired sessions
export function cleanupSessions(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const sessions = getSessions();
    const now = Date.now();
    let changed = false;
    
    for (const token in sessions) {
      if (sessions[token].expiresAt < now) {
        delete sessions[token];
        changed = true;
      }
    }
    
    if (changed) {
      saveSessions(sessions);
    }
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
} 