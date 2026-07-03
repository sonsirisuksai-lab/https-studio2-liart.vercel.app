# 🌌 COSMOS OS — Deployment Guide

This guide describes how to compile, configure, and deploy each platform of the COSMOS OS v5.0 monorepo.

---

## 🌐 Web App Deployment

The Web App (`@cosmos/web`) is a standard Single Page Application (SPA).

### 1. Vercel
Deployment on Vercel is configured automatically using `/vercel.json`.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Redirects**: Automatically maps all subroutes back to `index.html` for client-side routing.

### 2. Netlify
Configure using the included `/netlify.toml`.
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: Fully pre-configured for React Router subpaths.

---

## 📱 Mobile App Deployment (Expo EAS)

The Mobile App (`@cosmos/mobile`) utilizes Expo Application Services (EAS) for seamless remote builds.

### 1. Requirements
Ensure EAS CLI is installed:
```bash
npm install -g eas-cli
```

### 2. Local Setup
Generate credentials and log in:
```bash
eas login
eas project:init --id <project-id>
```

### 3. Running Builds
Build iOS or Android applications remotely:
```bash
# Preview build
eas build --platform all --profile preview

# Production build
eas build --platform all --profile production
```

---

## 💻 Desktop App Deployment (Tauri 2)

The Desktop App (`@cosmos/desktop`) bundles the production-built Web App into a native light binary using Rust and Tauri.

### 1. Requirements
Ensure Cargo and Rust are installed locally:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Compile Desktop Binary
Run the tauri compile script:
```bash
# From workspace root
npm run build:desktop

# Or directly in src-tauri folder
cargo tauri build
```
This produces native binaries (`.exe`, `.app`/`.dmg`, `.deb`/`.rpm`) inside `packages/desktop/src-tauri/target/release/bundle/`.
