const AUTH_KEY = 'auth_profile';

export function saveProfile(profile: any): void {
  if (!profile) {
    clearProfile();
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
  // Dispatch a custom event to notify of auth state changes
  window.dispatchEvent(new Event('auth-state-changed'));
}

export function getProfile(): any | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearProfile(): void {
  localStorage.removeItem(AUTH_KEY);
  // Dispatch a custom event to notify of auth state changes
  window.dispatchEvent(new Event('auth-state-changed'));
}