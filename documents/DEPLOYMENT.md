# Deployment Guide: Math et Matik

This guide explains how to take the source code from this environment and deploy it to the web using **GitHub** and **Vercel**.

Because this project uses TypeScript (`.tsx`) and React, it cannot be hosted as a simple static HTML file. We will use **Vite**, a modern frontend build tool, to package the app for production.

## Prerequisites

1.  **Node.js** installed on your computer.
2.  A **GitHub** account.
3.  A **Vercel** account.

---

## Phase 1: Local Project Setup

1.  **Open your terminal/command prompt** on your computer.
2.  **Create a new Vite project**:
    ```bash
    npm create vite@latest math-et-matik -- --template react-ts
    ```
3.  **Navigate into the folder**:
    ```bash
    cd math-et-matik
    ```
4.  **Install dependencies**:
    You need to install the libraries used in the code (Lucide for icons).
    ```bash
    npm install lucide-react
    ```

---

## Phase 2: Migrating the Code

You need to copy the files from this environment into your new local folder.

1.  **Clean up**: Delete the default `src/App.tsx` and `src/App.css` created by Vite.
2.  **Copy Files**:
    *   Move `App.tsx`, `types.ts`, and `constants.ts` into the `src/` folder.
    *   Copy the `components/`, `views/`, `services/`, `tomes/`, `data/`, and `localization/` folders into `src/`.
    *   *Note*: Ensure all imports in the code point to the correct relative paths (e.g., `./types` instead of `../types` depending on where you put them).

3.  **Update `index.css`**:
    Copy the Tailwind directives or CSS styles. If you want to use Tailwind (as used in the AI preview), you need to initialize Tailwind in Vite:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    Then configure `tailwind.config.js` to look at your files:
    ```js
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
           // Copy the theme/colors from the original index.html script tag here
           colors: {
              parchment: {
                100: '#EBEBEB',
                // ... copy the rest
              },
              // ... copy other colors
           },
           fontFamily: {
              serif: ['Cinzel', 'serif'],
              sans: ['Lato', 'sans-serif'],
           }
        },
      },
      plugins: [],
    }
    ```

4.  **Add Fonts**:
    Add the Google Fonts link to your local `index.html` (in the `public` or root folder of the Vite project):
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    ```

---

## Phase 3: Push to GitHub

1.  Initialize Git in your folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of Math et Matik"
    ```
2.  Go to **GitHub.com** and create a new repository (e.g., "math-et-matik").
3.  Follow the instructions to push your local code to the new repository:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/math-et-matik.git
    git push -u origin main
    ```

---

## Phase 4: Deploy to Vercel

1.  Go to **Vercel.com** and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your `math-et-matik` repository from GitHub.
4.  Click **Deploy**.

Vercel will build your project. Once finished, you will get a live URL (e.g., `https://math-et-matik.vercel.app`) that you can share with the world!

---

## Troubleshooting: "Save to GitHub" Button Fails

If the "Save to GitHub" button in the IDE only opens your profile or does nothing:

1.  **Manual Download**:
    *   You must manually copy the file contents from the editor into the files created in **Phase 2**.
    *   Copy `App.tsx` content -> Paste into local `src/App.tsx`.
    *   Repeat for `types.ts`, `constants.ts`, and all files in subfolders.

2.  **Verify Git Auth**:
    *   If you are trying to use the button, ensure you have authorized the AI Studio/IDX application in your GitHub settings (Settings -> Applications -> Authorized OAuth Apps).