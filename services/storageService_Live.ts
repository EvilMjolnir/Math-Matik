
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

// Step 1: Initialize Firebase
// Check for existing apps to handle hot-reload scenarios
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Step 2: Get Service Instances
const auth = firebase.auth();
const db = firebase.firestore();

// --- User Profile Management ---

export const saveUserProfile = async (player: PlayerStats): Promise<void> => {
    if (!player.uid) return;
    try {
        await db.collection("users").doc(player.uid).set(player, { merge: true });
    } catch (e) {
        console.error("Error saving profile:", e);
    }
};

export const loadUserProfile = async (email: string, passwordAttempt: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
    try {
        // 1. Authenticate with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, passwordAttempt);
        const user = userCredential.user;

        if (!user) {
            return { success: false, message: "Authentication failed." };
        }

        // 2. Fetch User Data from Firestore
        const userDocRef = db.collection("users").doc(user.uid);
        const userSnap = await userDocRef.get();

        if (userSnap.exists) {
            return { success: true, data: userSnap.data() as PlayerStats };
        } else {
            // Fallback: If auth exists but no DB record
            const newPlayer: PlayerStats = {
                ...DEFAULT_PLAYER,
                uid: user.uid,
                username: user.displayName || email.split('@')[0],
                email: email,
                photoURL: user.photoURL || ''
            };
            await userDocRef.set(newPlayer);
            return { success: true, data: newPlayer };
        }
    } catch (error: any) {
        return { success: false, message: error.message || "Login failed" };
    }
};

export const createUserProfile = async (email: string, password: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
    try {
        // 1. Create Auth User
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (!user) {
            return { success: false, message: "User creation failed." };
        }

        const username = email.split('@')[0];

        // 2. Prepare Data Object
        const newPlayer: PlayerStats = {
            ...DEFAULT_PLAYER,
            uid: user.uid,
            username: username,
            email: email,
            photoURL: ''
        };

        // 3. Update Auth Profile (Display Name)
        await user.updateProfile({ displayName: username });

        // 4. Save to Firestore
        await db.collection("users").doc(user.uid).set(newPlayer, { merge: true });

        return { success: true, data: newPlayer };

    } catch (error: any) {
        return { success: false, message: error.message || "Registration failed" };
    }
};

// --- Admin / System Utilities ---

export const getAllUsers = async (): Promise<PlayerStats[]> => {
    try {
        const querySnapshot = await db.collection("users").get();
        const users: PlayerStats[] = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data() as PlayerStats);
        });
        return users;
    } catch (e) {
        console.error("Error fetching users:", e);
        return [];
    }
};

export const getGlobalLeaderboard = async (limitCount = 10): Promise<PlayerStats[]> => {
    try {
        const querySnapshot = await db.collection("users")
            .orderBy("currentXp", "desc")
            .limit(limitCount)
            .get();
        
        const leaderboard: PlayerStats[] = [];
        querySnapshot.forEach((doc) => {
            leaderboard.push(doc.data() as PlayerStats);
        });
        return leaderboard;
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        return [];
    }
};

export const deleteUser = async (uid: string): Promise<void> => {
    try {
        // 1. Delete from Firestore
        await db.collection("users").doc(uid).delete();

        // 2. Delete from Auth (if currently logged in user matches)
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await currentUser.delete();
        }
    } catch (e) {
        console.error("Error deleting user:", e);
    }
};

export const createAdminProfile = async (): Promise<void> => {
    // No-op for cloud; admins are managed manually or via direct database edits
    return Promise.resolve();
};

export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
        // Attempt a lightweight fetch
        await db.collection("users").limit(1).get();
        return { success: true, message: "Connected to Firebase." };
    } catch (e: any) {
        return { success: false, message: e.message || "Connection failed." };
    }
};
