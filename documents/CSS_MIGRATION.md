
# CSS Migration Guide

Currently, the styling for animations, custom borders, and scrollbars resides in the `<style>` tag within `index.html`. To improve code maintainability and separate concerns, follow these steps to move the CSS into the dedicated `css/` directory.

## Current State
The project already contains a `css/` directory with the following files (though they are currently unused by the app):
- `css/animations.css`
- `css/holographic.css`
- `css/scrollbar.css`

## Migration Steps

### 1. Update the CSS Files
First, ensure the files in the `css/` directory contain the most up-to-date styles found in `index.html`.

**A. css/animations.css**
Copy the `@keyframes` and utility classes from `index.html` (e.g., `.slide-out-blurred-top`, `.roll-in-blurred-top`, `.animate-shake`).

**B. css/holographic.css**
Copy the `.holo-shine` and `.holo-rainbow` classes.

**C. css/borders.css (Create New)**
Create a new file `css/borders.css` and paste the `.border-roman` and `.border-bevel` classes there.

**D. css/base.css (Create New)**
Create a new file `css/base.css` and paste the `body` styles and global Scrollbar styles there.

### 2. Method A: Import via App.tsx (Recommended for Vite/Bundlers)
If you are using the build process (`npm run dev` or `npm run build`), the best way is to import these CSS files directly in your React entry point.

1. Open `index.tsx` (or `App.tsx`).
2. Add the following imports at the top:

```typescript
import './css/base.css';
import './css/scrollbar.css';
import './css/borders.css';
import './css/animations.css';
import './css/holographic.css';
```

### 3. Method B: Link via HTML (Legacy/Simple)
If you are running the app without a bundler (just serving `index.html`), link them in the `<head>` of `index.html`.

```html
<head>
    <!-- ... other tags ... -->
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/scrollbar.css">
    <link rel="stylesheet" href="./css/borders.css">
    <link rel="stylesheet" href="./css/animations.css">
    <link rel="stylesheet" href="./css/holographic.css">
</head>
```

### 4. Cleanup
Once linked (via Method A or B), delete the `<style>...</style>` block from `index.html` to avoid duplication.
