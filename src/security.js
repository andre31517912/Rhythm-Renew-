// ═══════════════════════════════════════════════════════════════
// RHYTHM — Security Utilities
// Password hashing, data encryption, input validation, rate limiting
// ═══════════════════════════════════════════════════════════════

// ─── crypto.subtle fallback for non-secure contexts (HTTP dev testing) ───
// crypto.subtle is only available over HTTPS or localhost.
// This fallback allows the app to run over HTTP on LAN for mobile dev testing.
// It is NOT used in production (Capacitor WebView = secure context).
async function _fallbackDigest(data) {
  const bytes = new Uint8Array(data);
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193);
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    out[i] = (h >>> (i % 4) * 8) & 0xff;
  }
  return out.buffer;
}

const _subtle = crypto.subtle || {
  async digest(algo, data) { return _fallbackDigest(data); },
  async importKey() { return {}; },
  async deriveKey() { return {}; },
  async encrypt(algo, key, data) { return data; },
  async decrypt(algo, key, data) { return data; },
};

// ─── Password Hashing (SHA-256 + Salt) ───
// Uses Web Crypto API for browser-native cryptographic hashing.
// Each password gets a unique random salt to prevent rainbow table attacks.

function generateSalt(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  if (!salt) salt = generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  // Iterate hashing 10000 times for key stretching
  let hash = data;
  for (let i = 0; i < 10000; i++) {
    hash = await _subtle.digest('SHA-256', hash);
    // After first iteration, hash is ArrayBuffer; convert for next iteration
    if (i < 9999) {
      const combined = new Uint8Array(hash.byteLength + data.byteLength);
      combined.set(new Uint8Array(hash), 0);
      combined.set(data, hash.byteLength);
      hash = combined.buffer;
    }
  }
  return { hash: bufferToHex(hash), salt };
}

async function verifyPassword(password, storedHash, salt) {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

// ─── Data Encryption (AES-GCM via Web Crypto API) ───
// Encrypts sensitive health data before storing in localStorage.
// Uses a key derived from the user's password + a stored salt.

async function deriveEncryptionKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await _subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return _subtle.deriveKey(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(plaintext, password, salt) {
  const key = await deriveEncryptionKey(password, salt);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await _subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );
  // Store IV + ciphertext together as hex
  const ivHex = Array.from(iv, b => b.toString(16).padStart(2, '0')).join('');
  const ctHex = bufferToHex(encrypted);
  return ivHex + ':' + ctHex;
}

async function decryptData(ciphertext, password, salt) {
  try {
    const key = await deriveEncryptionKey(password, salt);
    const [ivHex, ctHex] = ciphertext.split(':');
    const iv = new Uint8Array(ivHex.match(/.{2}/g).map(h => parseInt(h, 16)));
    const ct = new Uint8Array(ctHex.match(/.{2}/g).map(h => parseInt(h, 16)));
    const decrypted = await _subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ct
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

// ─── Input Validation ───

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required.';
  const trimmed = email.trim();
  if (trimmed.length > 254) return 'Email is too long.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (password.length > 128) return 'Password is too long.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include a number.';
  return null;
}

function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required.';
  const trimmed = name.trim();
  if (trimmed.length < 1) return 'Name is required.';
  if (trimmed.length > 50) return 'Name must be 50 characters or less.';
  if (/[<>"'&;(){}]/.test(trimmed)) return 'Name contains invalid characters.';
  return null;
}

function validateAge(age) {
  const num = parseInt(age, 10);
  if (isNaN(num)) return 'Please enter a valid age.';
  if (num < 10 || num > 100) return 'Age must be between 10 and 100.';
  return null;
}

function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ─── Rate Limiter ───
// Tracks login attempts per email, blocks after maxAttempts within windowMs.

class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = {};
  }

  isBlocked(key) {
    const record = this.attempts[key];
    if (!record) return false;
    // Clean up expired entries
    const now = Date.now();
    record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);
    if (record.timestamps.length === 0) {
      delete this.attempts[key];
      return false;
    }
    return record.timestamps.length >= this.maxAttempts;
  }

  recordAttempt(key) {
    if (!this.attempts[key]) {
      this.attempts[key] = { timestamps: [] };
    }
    this.attempts[key].timestamps.push(Date.now());
  }

  getRemainingTime(key) {
    const record = this.attempts[key];
    if (!record || record.timestamps.length === 0) return 0;
    const oldest = Math.min(...record.timestamps);
    const remaining = this.windowMs - (Date.now() - oldest);
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  reset(key) {
    delete this.attempts[key];
  }
}

// ─── Session Management ───

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function createSession(email, name) {
  return {
    email,
    name,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
}

function isSessionValid(session) {
  if (!session) return false;
  if (!session.expiresAt) return false;
  return Date.now() < session.expiresAt;
}

// ─── Data Export ───

function exportUserData(userData, authUser) {
  const exportData = {
    exportDate: new Date().toISOString(),
    account: { email: authUser?.email, name: userData.name },
    profile: {
      age: userData.age,
      cycleLength: userData.cycleLength,
      periodDuration: userData.periodDuration,
      regularity: userData.regularity,
      fitnessLevel: userData.fitnessLevel,
      dietPreferences: userData.dietPreferences,
      allergies: userData.allergies,
      nutritionGoals: userData.nutritionGoals,
      workoutPreferences: userData.workoutPreferences,
      stressRelief: userData.stressRelief,
    },
    journalEntries: userData.journalEntries,
    moodLog: userData.moodLog,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rhythm-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function deleteAllUserData(email) {
  const keysToDelete = [
    `rhythm-user-${email}`,
    `rhythm-userdata-${email}`,
    `rhythm-encryption-salt-${email}`,
    'rhythm-session',
  ];
  for (const key of keysToDelete) {
    try { await window.storage.delete(key); } catch {}
  }
}

// ─── Exports ───

export {
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData,
  validateEmail,
  validatePassword,
  validateName,
  validateAge,
  sanitizeText,
  RateLimiter,
  createSession,
  isSessionValid,
  exportUserData,
  deleteAllUserData,
  generateSalt,
};
