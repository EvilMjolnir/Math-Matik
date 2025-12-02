# Local Asset Deployment Guide

This document outlines the steps required to configure "Math et Matik" to use local resources (images, audio, fonts) instead of external CDNs or hyperlinks. This ensures the game runs completely offline (excluding the Gemini API) and allows for custom asset management.

## 1. Directory Structure Setup

To serve files locally, you need to create a dedicated directory for your static assets. We recommend the following structure at the root of your project:

```text
/ (project root)
├── index.html
├── index.tsx
├── App.tsx
├── localization/     <-- Language files (included in source)
├── tomes/            <-- Game data (included in source)
└── assets/           <-- Create this folder for media
    ├── images/       <-- For backgrounds, icons, textures
    │   ├── background.png
    │   └── texture.png
    ├── audio/        <-- For sfx and music
    │   ├── click.mp3
    │   ├── success.mp3
    │   └── music_loop.mp3
    └── fonts/        <-- (Optional) Local font files
```

## 2. Managing Images

### Background Images
Currently, background textures are loaded via URL in `App.tsx`.

**Current Code:**
```tsx
<div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
```

**Local Setup:**
1. Download the texture and save it as `assets/images/dark-leather.png`.
2. Update the code to reference the relative path. Note that in a pure React/ES module setup without a bundler (like Webpack/Vite), paths are relative to the `index.html`.

**Updated Code:**
```tsx
<div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('./assets/images/dark-leather.png')]"></div>
```

## 3. Managing Audio

To add music or sound effects (Roadmap v1.6):

1. Place your `.mp3` or `.wav` files in `assets/audio/`.
2. In your React components load them using the native `Audio` API.

**Example Implementation:**
```typescript
const playClickSound = () => {
  const audio = new Audio('./assets/audio/click.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Audio play failed", e));
};
```

## 4. Hosting Locally

Because this project uses ES Modules (`<script type="module">` in `index.html`) and will be loading local assets, **you cannot simply open `index.html` by double-clicking it.** Browsers block local file access (CORS policies) for security reasons.

You must run a local HTTP server.

### Option A: VS Code "Live Server" (Recommended)
1. Install the **Live Server** extension for VS Code.
2. Right-click `index.html` in the file explorer.
3. Select **"Open with Live Server"**.
4. The game will open at `http://127.0.0.1:5500`.

### Option B: Python
If you have Python installed, open your terminal in the project root and run:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

### Option C: Node.js http-server
If you have Node.js installed:
```bash
npx http-server .
```
