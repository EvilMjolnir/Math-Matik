
import { PlayerStats } from '../types';
import { DEFAULT_PLAYER } from '../constants';

const STORAGE_KEY = 'math_et_matik_users';

interface UserDatabase {
  [username: string]: PlayerStats;
}

const getDB = (): UserDatabase => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveDB = (db: UserDatabase) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const saveUserProfile = (player: PlayerStats) => {
  const db = getDB();
  db[player.username] = player;
  saveDB(db);
};

export const loadUserProfile = (username: string, passwordAttempt: string): { success: boolean; data?: PlayerStats; message?: string } => {
  const db = getDB();
  const user = db[username];

  if (!user) {
    return { success: false, message: "User not found." };
  }

  // Simple string comparison for this demo
  if (user.password !== passwordAttempt) {
    return { success: false, message: "Incorrect password." };
  }

  return { success: true, data: user };
};

export const createUserProfile = (username: string, password: string): { success: boolean; data?: PlayerStats; message?: string } => {
  const db = getDB();
  
  if (db[username]) {
    return { success: false, message: "Username already exists." };
  }

  const newUser: PlayerStats = {
    ...DEFAULT_PLAYER,
    username: username,
    password: password
  };

  db[username] = newUser;
  saveDB(db);

  return { success: true, data: newUser };
};

export const createAdminProfile = () => {
    const db = getDB();
    if (!db["Gandalf"]) {
        const adminUser: PlayerStats = {
            ...DEFAULT_PLAYER,
            username: "Gandalf",
            password: "YouShallNotPass",
            level: 100,
            gold: 99999,
            maxHp: 9999,
            currentHp: 9999
        };
        db["Gandalf"] = adminUser;
        saveDB(db);
        console.log("Admin profile created.");
    }
};

export const getAllUsers = (): PlayerStats[] => {
  const db = getDB();
  return Object.values(db);
};

export const deleteUser = (username: string) => {
  const db = getDB();
  // Unconditionally delete the key and save. 
  // If the key doesn't exist, delete is a no-op, but saving ensures consistency.
  delete db[username];
  saveDB(db);
};
