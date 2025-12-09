
import React, { useState } from 'react';
import { PlayerStats, StorageMode } from '../types';
import { DEFAULT_PLAYER } from '../constants';
import * as localStore from '../services/storageService';
import * as cloudStore from '../services/storageService_Live';
import { Scroll, Shield, UserPlus, LogIn, User, ArrowLeft, Cloud, Database, Loader2 } from 'lucide-react';
import { useLocalization } from '../localization';
import { APP_VERSION } from '../version';

interface AuthScreenProps {
  onLogin: (player: PlayerStats, mode: StorageMode) => void;
  currentStorageMode: StorageMode;
  onSetStorageMode: (mode: StorageMode) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, currentStorageMode, onSetStorageMode }) => {
  const { t, lang, setLang } = useLocalization();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getService = () => currentStorageMode === StorageMode.CLOUD ? cloudStore : localStore;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const service = getService();

    if (isLoginMode) {
      const result = await service.loadUserProfile(username, password);
      if (result.success && result.data) {
        onLogin(result.data, currentStorageMode);
      } else {
        setError(result.message || 'Login failed');
      }
    } else {
      const result = await service.createUserProfile(username, password);
      if (result.success && result.data) {
        onLogin(result.data, currentStorageMode);
      } else {
        setError(result.message || 'Registration failed');
      }
    }
    setIsLoading(false);
  };

  const handleGuestLogin = () => {
    const guestPlayer: PlayerStats = {
      ...DEFAULT_PLAYER,
      username: "Guest Explorer"
    };
    onLogin(guestPlayer, StorageMode.LOCAL);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-parchment-900 p-4 relative">
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
          className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 font-bold font-serif w-12 h-12 flex items-center justify-center text-parchment-100"
          title="Switch Language"
        >
          {lang.toUpperCase()}
        </button>
      </div>

      <div className="w-full max-w-md bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-parchment-800 rounded-full flex items-center justify-center border-4 border-amber-600 mb-4 shadow-lg">
            <Scroll className="w-10 h-10 text-parchment-100" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-parchment-900 text-center">{t.titles.home}</h1>
          <p className="text-parchment-700 italic">{t.auth.welcome}</p>
        </div>

        {/* Storage Mode Toggle */}
        <div className="flex justify-center mb-6">
           <div className="bg-parchment-300 rounded-full p-1 flex shadow-inner border border-parchment-400">
              <button 
                onClick={() => onSetStorageMode(StorageMode.LOCAL)}
                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center transition-all ${currentStorageMode === StorageMode.LOCAL ? 'bg-parchment-800 text-white shadow-md' : 'text-parchment-800 hover:bg-parchment-400'}`}
              >
                <Database className="w-4 h-4 mr-2" />
                {t.auth.local}
              </button>
              <button 
                onClick={() => onSetStorageMode(StorageMode.CLOUD)}
                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center transition-all ${currentStorageMode === StorageMode.CLOUD ? 'bg-blue-700 text-white shadow-md' : 'text-parchment-800 hover:bg-parchment-400'}`}
              >
                <Cloud className="w-4 h-4 mr-2" />
                {t.auth.cloud}
              </button>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-parchment-900 font-bold mb-1 font-serif">
              {currentStorageMode === StorageMode.LOCAL ? t.profile.heroName : t.auth.email}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-parchment-100 border-2 border-parchment-400 rounded focus:border-amber-600 focus:outline-none text-parchment-900 font-bold"
              placeholder={currentStorageMode === StorageMode.LOCAL ? t.profile.heroName : t.auth.placeholders.email}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-parchment-900 font-bold mb-1 font-serif">{t.auth.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-parchment-100 border-2 border-parchment-400 rounded focus:border-amber-600 focus:outline-none text-parchment-900 font-bold"
              placeholder={t.auth.placeholders.code}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-center font-bold bg-red-100 p-2 rounded border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-parchment-800 hover:bg-parchment-900 text-parchment-100 font-serif font-bold text-xl rounded border-2 border-amber-600 transition-all shadow-md active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <>
                 {isLoginMode ? <LogIn className="mr-2 w-5 h-5"/> : <UserPlus className="mr-2 w-5 h-5"/>}
                 {isLoginMode ? t.auth.enterRealm : t.auth.createProfile}
              </>
            )}
          </button>
        </form>

        {isLoginMode ? (
          <div className="mt-6 border-t-2 border-parchment-300 pt-6 space-y-4">
              <div>
                <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full py-3 bg-parchment-300 hover:bg-parchment-400 text-parchment-800 font-serif font-bold text-lg rounded border-2 border-parchment-400 border-dashed transition-all hover:border-parchment-600 flex items-center justify-center disabled:opacity-50"
                >
                    <User className="mr-2 w-5 h-5" />
                    {t.auth.playGuest}
                </button>
                <p className="text-center text-xs text-parchment-600 mt-1 italic">
                    {t.auth.guestWarning}
                </p>
              </div>

              <button
                  type="button"
                  onClick={() => { setIsLoginMode(false); setError(''); }}
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-serif font-bold text-lg rounded border-2 border-amber-400 transition-all hover:border-amber-600 flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                  <UserPlus className="mr-2 w-5 h-5" />
                  {t.auth.createNew}
              </button>
          </div>
        ) : (
          <div className="mt-6 border-t-2 border-parchment-300 pt-6">
              <button
                  type="button"
                  onClick={() => { setIsLoginMode(true); setError(''); }}
                  disabled={isLoading}
                  className="w-full py-3 bg-parchment-300 hover:bg-parchment-400 text-parchment-800 font-serif font-bold text-lg rounded border-2 border-parchment-400 transition-all hover:border-parchment-600 flex items-center justify-center disabled:opacity-50"
              >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  {t.auth.backLogin}
              </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-parchment-500 text-sm flex flex-col items-center opacity-50">
        <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            {t.auth.secure}
        </div>
        <div className="text-xs mt-1 font-mono">v{APP_VERSION} - {currentStorageMode}</div>
      </div>
    </div>
  );
};

export default AuthScreen;
