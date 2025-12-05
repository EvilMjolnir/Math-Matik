# Firebase Migration Technical Specification

## 1. Executive Summary
The application is currently in a broken state due to a **version mismatch** between the library imports defined in `index.html` and the implementation logic in `services/storageService_Live.ts`.

*   **Environment**: `index.html` imports **Firebase v11 (Modular SDK)** via ESM.
*   **Implementation**: `storageService_Live.ts` uses **Firebase v8 (Namespaced SDK)** syntax.

This mismatch causes the critical error:
> `Uncaught SyntaxError: The requested module 'firebase/app' does not provide an export named 'default'`

## 2. The Loop of Failure
Attempts to fix this have failed due to a cycle of partial migrations:

1.  **Attempt A**: The import map is updated to v11, but the code relies on `firebase.default`. **Result**: Syntax Error (No default export).
2.  **Attempt B**: The code tries to import named exports (v11) but attempts to use them with v8 method chaining (e.g., `db.collection(...)`). **Result**: Runtime Error (`db.collection` is not a function).
3.  **Attempt C**: To fix runtime errors, the implementation reverts to v8/Compat syntax, which conflicts with the v11 strict ESM environment. **Result**: Back to Syntax Error.

## 3. Required Fix Implementation

To resolve this, `services/storageService_Live.ts` must be completely refactored to use **Functional Programming** patterns required by Firebase v10/v11.

### 3.1 Import Changes
**Current (Broken):**
```typescript
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
```

**Required (Fixed):**
```typescript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  deleteUser as deleteFirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  limit, 
  deleteDoc 
} from 'firebase/firestore';
```

### 3.2 Initialization Changes
**Current (Broken):**
```typescript
if (!firebase.apps.length) firebase.initializeApp(config);
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
```

**Required (Fixed):**
```typescript
// Initialize implicitly returns the app instance
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
```

### 3.3 Database Logic Changes (No Method Chaining)

**Write Operation:**
*   **Old:** `await db.collection("users").doc(uid).set(data, { merge: true });`
*   **New:** `await setDoc(doc(db, "users", uid), data, { merge: true });`

**Read Operation (Single):**
*   **Old:** `const doc = await db.collection("users").doc(uid).get();`
*   **New:** `const docSnap = await getDoc(doc(db, "users", uid));`

**Read Operation (Query):**
*   **Old:** `await db.collection("users").orderBy("xp").limit(10).get();`
*   **New:** 
    ```typescript
    const q = query(collection(db, "users"), orderBy("xp"), limit(10));
    const snapshot = await getDocs(q);
    ```

### 3.4 Auth Changes
**Sign In:**
*   **Old:** `await auth.signInWithEmailAndPassword(email, password);`
*   **New:** `await signInWithEmailAndPassword(auth, email, password);`

**Current User:**
*   **Old:** `auth.currentUser`
*   **New:** `auth.currentUser` (This property remains accessible on the auth instance).

## 4. Action Plan for Developer
1.  **Do NOT touch `index.html`**: It is correctly set to v11.
2.  **Rewrite `services/storageService_Live.ts`**:
    *   Remove all default imports.
    *   Import specific functions from `firebase/app`, `firebase/auth`, and `firebase/firestore`.
    *   Refactor `saveUserProfile`, `loadUserProfile`, `createUserProfile`, `getAllUsers`, `getGlobalLeaderboard`, and `deleteUser` to use the functions defined in Section 3.3.
