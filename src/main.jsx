import React from 'react';
import ReactDOM from 'react-dom/client';
import { Preferences } from '@capacitor/preferences';
import RhythmApp from '../rhythm-app.jsx';

// Bridge window.storage to Capacitor Preferences (native key-value storage).
// Uses SharedPreferences on Android, UserDefaults on iOS, localStorage on web.
window.storage = {
  async get(key) {
    const { value } = await Preferences.get({ key });
    return value !== null ? { value } : null;
  },
  async set(key, value) {
    await Preferences.set({ key, value });
  },
  async delete(key) {
    await Preferences.remove({ key });
  },
};

// Render the app first, then seed a test account in the background
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RhythmApp />
  </React.StrictMode>
);

// Seed a test account (test@rhythm.app / Test1234) if one doesn't exist
(async () => {
  try {
    const { hashPassword, generateSalt } = await import('./security.js');
    const email = 'test@rhythm.app';
    const existing = await window.storage.get(`rhythm-user-${email}`);
    if (existing?.value) return;
    const { hash, salt } = await hashPassword('Test1234');
    const user = { email, name: 'Test User', passwordHash: hash, salt, created: new Date().toISOString() };
    await window.storage.set(`rhythm-user-${email}`, JSON.stringify(user));
    await window.storage.set(`rhythm-encryption-salt-${email}`, generateSalt());
  } catch (e) {
    console.warn('Test account seed failed:', e);
  }
})();
