import React from 'react';
import { FileSpreadsheet, ShieldCheck, History, HelpCircle, Globe, LogOut, HardDrive, CheckCircle2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  historyCount: number;
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
  user?: User | null;
  onConnectGoogle?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  onOpenHelp,
  currentLang,
  onToggleLang,
  user,
  onConnectGoogle,
  onLogout,
}) => {
  const t = translations[currentLang];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">
                DocuFinance <span className="text-emerald-400 font-mono text-sm bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Google Workspace Connection Pill / Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="truncate max-w-[120px] text-[11px] font-medium text-white">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                title={currentLang === 'id' ? 'Keluar dari Google' : 'Sign out from Google'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            onConnectGoogle && (
              <button
                onClick={onConnectGoogle}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            )
          )}

          {/* Prominent Bilingual Language Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700/80 shadow-md">
            <div className="hidden md:flex items-center gap-1 px-2 text-[11px] font-semibold text-slate-400 border-r border-slate-800 mr-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'id' ? 'Bahasa:' : 'Language:'}</span>
            </div>
            <button
              type="button"
              onClick={() => onToggleLang('id')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer text-xs font-bold ${
                currentLang === 'id'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ganti ke Bahasa Indonesia"
            >
              <span>🇮🇩</span>
              <span>Indonesia</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer text-xs font-bold ${
                currentLang === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            title={t.historyBtn}
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t.historyBtn}</span>
            {historyCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            title={t.formatGuideBtn}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">{t.formatGuideBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
