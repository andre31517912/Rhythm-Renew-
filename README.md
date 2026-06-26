# Rhythm — Period Wellness Companion

Rhythm is a mobile-first wellness app that helps users track their menstrual cycle and receive personalized daily recommendations for nutrition, workouts, meditation, and mental wellness — all tailored to the four phases of the menstrual cycle (menstrual, follicular, ovulatory, luteal).

Built with React and Capacitor, it runs as a web app in the browser and can be packaged as a native iOS/Android app.

---

## Demo

A demo video is available in the [Releases](https://github.com/andre31517912/Rhythm-Renew-/releases) section of this repository.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, JSX |
| **Build Tool** | Vite 8 |
| **Styling** | CSS-in-JS (embedded in component), Google Fonts (Fraunces, DM Sans) |
| **Storage** | Capacitor Preferences (SharedPreferences on Android, UserDefaults on iOS, localStorage on web) |
| **Security** | Web Crypto API (SHA-256 hashing, AES-GCM encryption, PBKDF2 key derivation) |
| **Native Packaging** | Capacitor 8 (iOS + Android) |
| **Language** | JavaScript (ES Modules) |

---

## Features

- **Cycle Tracking** — Input your last period date, cycle length, and period duration. The app calculates your current phase and cycle day automatically.
- **Phase-Aware Dashboard** — The home screen adapts its color scheme, greeting, tips, and content to your current menstrual phase.
- **Personalized Recipes** — 30 recipes across all four phases, filtered by dietary preferences (vegan, gluten-free, paleo, etc.) and allergens.
- **Custom Workouts** — 16 structured workout routines with warm-ups, exercises (sets/reps/holds), cooldowns, and muscle group guidance per phase.
- **Meditation Timer** — Built-in timer with guided meditation options. Visual breathing animation during active sessions.
- **Mood & Journal** — Log daily mood and write journal entries with phase-specific prompts. Entries are stored locally and tagged by phase.
- **Body Education** — Detailed breakdowns of what's happening in your body during each phase, including which muscle groups to focus on or avoid and why.
- **Onboarding Flow** — Multi-step onboarding that collects cycle data, diet preferences, allergies, fitness level, workout preferences, stress habits, and sleep quality.
- **Auth System** — Local signup/login with SHA-256 password hashing (10,000 iterations), rate-limited login attempts, and 7-day session expiry.
- **Data Privacy** — AES-GCM encryption support for stored health data. Export your data as JSON or delete your account entirely.
- **Cross-Platform** — Runs in the browser, or as a native app on iOS and Android via Capacitor.

---

## File Structure

```
rhythm/
├── index.html                 # Entry point HTML — loads the React app
├── rhythm-app.jsx             # Main app component (all screens, UI, logic, data)
├── package.json               # Dependencies and scripts
├── package-lock.json          # Locked dependency versions
├── vite.config.js             # Vite build configuration
├── capacitor.config.json      # Capacitor config (app ID, name, build dir)
├── rhythm demo .mp4           # Demo video of the app
│
├── src/
│   ├── main.jsx               # React entry point — renders <RhythmApp />, sets up storage bridge
│   └── security.js            # Security utilities (hashing, encryption, validation, rate limiting)
│
├── android/                   # Capacitor-generated Android project (gitignored)
├── ios/                       # Capacitor-generated iOS project (gitignored)
├── dist/                      # Vite build output (gitignored)
└── node_modules/              # Installed packages (gitignored)
```

### Key Files Explained

| File | What It Does |
|---|---|
| `rhythm-app.jsx` | Contains the entire app: phase data (symptoms, nutrition, movement, mental wellness), 30 recipes, 16 workouts, 8 meditations, all UI screens (splash, auth, onboarding, home, nutrition, fitness, wellness, profile), and all app logic. |
| `src/main.jsx` | Boots the React app, bridges `window.storage` to Capacitor Preferences (SharedPreferences on Android, UserDefaults on iOS, localStorage on web), and seeds a test account. |
| `src/security.js` | Password hashing (SHA-256 with salt, 10k iterations), AES-GCM data encryption, input validation (email, password, name, age), HTML sanitization, rate limiting, session management, data export/delete. |
| `capacitor.config.json` | Tells Capacitor the app ID (`com.rhythm.app`), name, and that the built web assets live in `dist/`. |

---

## Prerequisites

- **Node.js** — v18 or higher ([download](https://nodejs.org/))
- **npm** — Comes with Node.js

For native mobile builds (optional):
- **Android Studio** — For Android builds
- **Xcode** — For iOS builds (macOS only)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/andre31517912/Rhythm-Renew-.git
cd Rhythm-Renew-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

This starts a Vite dev server. Open the URL shown in terminal (usually `http://localhost:5173`) in your browser.

### 4. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## Running on Mobile (Capacitor)

### Android

```bash
npm run build
npx cap sync android
npx cap open android
```

This opens the project in Android Studio. Click **Run** to deploy to an emulator or connected device.

### iOS (macOS only)

```bash
npm run build
npx cap sync ios
npx cap open ios
```

This opens the project in Xcode. Select a simulator or device and click **Run**.

---

## Data Storage

Rhythm does **not** use a traditional database. All data is stored locally on the user's device:

| Platform | Storage Mechanism | Location |
|---|---|---|
| Web (browser) | `localStorage` | Browser storage |
| Android | `SharedPreferences` | App sandbox |
| iOS | `UserDefaults` | App sandbox |

The storage is accessed through Capacitor's `Preferences` plugin, which is bridged to `window.storage` in `src/main.jsx`.

### Stored Keys

| Key Pattern | Contents |
|---|---|
| `rhythm-user-{email}` | Account data (email, name, password hash, salt, creation date) |
| `rhythm-userdata-{email}` | All user wellness data (cycle info, preferences, journal entries, mood log) |
| `rhythm-encryption-salt-{email}` | Salt used for AES-GCM encryption of health data |
| `rhythm-session` | Current session (email, name, creation time, expiry) |

### Test Account

A test account is automatically seeded on first launch:
- **Email:** `test@rhythm.app`
- **Password:** `Test1234`

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | React DOM renderer |
| `@capacitor/core` | ^8.3.0 | Capacitor runtime |
| `@capacitor/cli` | ^8.3.0 | Capacitor CLI tools |
| `@capacitor/android` | ^8.3.0 | Android native bridge |
| `@capacitor/ios` | ^8.3.0 | iOS native bridge |
| `@capacitor/preferences` | ^8.0.1 | Key-value storage (SharedPreferences / UserDefaults / localStorage) |

### Dev

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8.0.3 | Build tool and dev server |
| `@vitejs/plugin-react` | ^6.0.1 | React support for Vite (JSX transform, fast refresh) |
| `vite-plugin-mkcert` | ^2.0.0 | Local HTTPS certificates for dev |

---

## Security

- Passwords are hashed with SHA-256 + unique salt, iterated 10,000 times
- Login is rate-limited to 5 attempts per 15 minutes per email
- Sessions expire after 7 days
- Health data can be encrypted with AES-GCM (key derived via PBKDF2 from user password)
- All user input is sanitized to prevent XSS
- Content Security Policy headers are set in `index.html`
- No data leaves the device — everything is stored locally
