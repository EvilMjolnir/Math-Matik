
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

export const saveUserProfile = async (player: PlayerStats): Promise<void> => {
  const db = getDB();
  db[player.username] = player;
  saveDB(db);
  return Promise.resolve();
};

export const loadUserProfile = async (identifier: string, passwordAttempt: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
  const db = getDB();
  
  // Try finding by username (key)
  let user = db[identifier];

  // If not found, try finding by email
  if (!user) {
    user = Object.values(db).find(u => u.email === identifier) as PlayerStats | undefined;
  }

  if (!user) {
    return Promise.resolve({ success: false, message: "User not found." });
  }

  // Simple string comparison for this demo
  if (user.password !== passwordAttempt) {
    return Promise.resolve({ success: false, message: "Incorrect password." });
  }

  return Promise.resolve({ success: true, data: user });
};

export const createUserProfile = async (username: string, password: string): Promise<{ success: boolean; data?: PlayerStats; message?: string }> => {
  const db = getDB();
  
  if (db[username]) {
    return Promise.resolve({ success: false, message: "Username already exists." });
  }

  const newUser: PlayerStats = {
    ...DEFAULT_PLAYER,
    username: username,
    password: password
  };

  db[username] = newUser;
  saveDB(db);

  return Promise.resolve({ success: true, data: newUser });
};

export const createAdminProfile = async (): Promise<void> => {
    const db = getDB();
    if (!db["Gandalf"]) {
        const adminUser: PlayerStats = {
            ...DEFAULT_PLAYER,
            username: "Gandalf",
            password: "//zz",
            level: 100,
            gold: 99999,
            maxHp: 9999,
            currentHp: 9999,
            nums: 99
        };
        db["Gandalf"] = adminUser;
        saveDB(db);
        console.log("Gandalf appears!!!.");
    } else {
        // Ensure existing Gandalf has resources for testing new features
        const gandalf = db["Gandalf"];
        let updated = false;
        
        if ((gandalf.nums || 0) < 99) {
            gandalf.nums = 99;
            updated = true;
        }
        
        if (updated) {
            db["Gandalf"] = gandalf;
            saveDB(db);
        }
    }
    return Promise.resolve();
};

export const getAllUsers = async (): Promise<PlayerStats[]> => {
  const db = getDB();
  return Promise.resolve(Object.values(db));
};

export const getGlobalLeaderboard = async (limitCount = 10): Promise<PlayerStats[]> => {
  const db = getDB();
  const users = Object.values(db);
  // Sort by XP descending
  users.sort((a, b) => b.currentXp - a.currentXp);
  return Promise.resolve(users.slice(0, limitCount));
}

export const deleteUser = async (username: string): Promise<void> => {
  const db = getDB();
  delete db[username];
  saveDB(db);
  return Promise.resolve();
};
