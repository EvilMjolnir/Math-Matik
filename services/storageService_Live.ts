// @ts-nocheck
// TypeScript errors are expected in Google AI Studio due to import map usage
// This file works correctly at runtime in both AI Studio and Vercel
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
  where,
  orderBy, 
  limit, 
  deleteDoc 
} from 'firebase/firestore';
import { PlayerStats } from "../types";
import { DEFAULT_PLAYER } from "../constants";

const firebaseConfig = {
  apiKey: "AIzaSyD4SyM1CZSD8NerQmnHmzWExUkFOWPhjbU",
  authDomain: "mathmatik-35f04.firebaseapp.com",
  projectId: "mathmatik-35f04",
  storageBucket: "mathmatik-35f04.firebasestorage.app",
  messagingSenderId: "1023139472400",
  appId: "1:1023139472400:web:09fab7ac17cc0ffa835695",
  measurementId: "G-WLE7XNWK6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Service Functions ---

export const saveUserProfile = async (player: PlayerStats): Promise<void> => {
    if (!player.uid) {
        console.warn("Save Aborted: Missing player UID.");
        return;
    }

    try {
        // Firestore cannot handle 'undefined'. We strip them out.
        const safePlayer = JSON.parse(JSON.stringify(player));
        await setDoc(doc(db, "users", player.uid), safePlayer, { merge: true });

        // Sync Firebase Auth Display Name if changed
        const currentUser = auth.currentUser;
        if (currentUser && player.username && currentUser.displayName !== player.username) {
             await updateProfile(currentUser, { displayName: player.username });
        }
    } catch (e) {
        console.error("Error saving profile to Firestore:", e);
    }
};

export const loadUserProfile = async (identifier: string, passwordAttempt: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
    let email = identifier;

    // If it looks like a username (no @), try to resolve email from Firestore
    if (!identifier.includes('@')) {
        try {
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("username", "==", identifier), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data() as PlayerStats;
                if (userData.email) {
                    email = userData.email;
                } else {
                    return { success: false, message: "Account found but missing email record." };
                }
            } else {
                return { success: false, message: "User not found." };
            }
        } catch (e) {
            console.error("Username lookup failed:", e);
            // Fallthrough to try generic login or fail? 
            // If lookup failed (e.g. permission), we can't do username login.
            return { success: false, message: "Login failed: Unable to verify username." };
        }
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, passwordAttempt);
        const user = userCredential.user;

        if (!user) {
            return { success: false, message: "Authentication failed." };
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        const safeUsername = user.displayName || (email ? email.split('@')[0] : 'Hero');

        if (userDocSnap.exists()) {
            return { success: true, data: userDocSnap.data() as PlayerStats };
        } else {
            // Fallback: User authenticated but no profile doc exists
            const newPlayer: PlayerStats = {
                ...DEFAULT_PLAYER,
                uid: user.uid,
                username: safeUsername,
                email: email,
                photoURL: user.photoURL || ''
            };
            // Sanitize undefined fields
            const safePlayer = JSON.parse(JSON.stringify(newPlayer));
            
            await setDoc(userDocRef, safePlayer);
            return { success: true, data: newPlayer };
        }
    } catch (error: any) {
        console.error("Login Error:", error);
        return { success: false, message: error.message || "Login failed" };
    }
};

export const createUserProfile = async (email: string, password: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user) {
            return { success: false, message: "User creation failed." };
        }

        const username = email ? email.split('@')[0] : 'Hero';

        const newPlayer: PlayerStats = {
            ...DEFAULT_PLAYER,
            uid: user.uid,
            username: username,
            email: email,
            photoURL: ''
        };

        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: username });
        }
        
        // Sanitize DEFAULT_PLAYER's undefined fields (like activeCompanionId)
        const safePlayer = JSON.parse(JSON.stringify(newPlayer));
        
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, safePlayer, { merge: true });

        return { success: true, data: newPlayer };

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { success: false, message: error.message || "Registration failed" };
    }
};

// --- Admin / System Utilities ---

export const getAllUsers = async (): Promise<PlayerStats[]> => {
    try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const users: PlayerStats[] = [];
        querySnapshot.forEach((docSnap) => {
            users.push(docSnap.data() as PlayerStats);
        });
        return users;
    } catch (e) {
        console.error("Error fetching users:", e);
        return [];
    }
};

export const getGlobalLeaderboard = async (limitCount = 10): Promise<PlayerStats[]> => {
    try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, orderBy("currentXp", "desc"), limit(limitCount));
        const querySnapshot = await getDocs(q);
        
        const leaderboard: PlayerStats[] = [];
        querySnapshot.forEach((docSnap) => {
            leaderboard.push(docSnap.data() as PlayerStats);
        });
        return leaderboard;
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        return [];
    }
};

export const deleteUser = async (uid: string): Promise<void> => {
    try {
        const userDocRef = doc(db, "users", uid);
        await deleteDoc(userDocRef);
        
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await deleteFirebaseUser(currentUser);
        } else {
             console.warn("Note: Auth user deletion skipped. Client-side admin can only delete Firestore data for other users.");
        }
    } catch (e) {
        console.error("Error deleting user:", e);
    }
};

export const createAdminProfile = async (): Promise<void> => {
    return Promise.resolve();
};