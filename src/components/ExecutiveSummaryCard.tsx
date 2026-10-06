import React, { useState } from 'react';
import { Sparkles, Copy, Check, Volume2, VolumeX, BadgeCheck, Languages } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ExecutiveSummaryCardProps {
  summary: string;
  summaryEn?: string;
  documentType: string;
  confidenceScore?: number;
  category?: string;
  currentLang: Language;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  summary,
  summaryEn,
  documentType,
  confidenceScore = 0.98,
  category,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [activeLang, setActiveLang] = useState<'id' | 'en'>(currentLang);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fallback to primary summary if English isn't populated
  const displaySummary =
    activeLang === 'en'
      ? summaryEn || summary
      : summary;

  const handleCopy = () => {
    navigator.clipboard.writeText(displaySummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert(currentLang === 'id' ? 'Peramban Anda tidak mendukung Text-to-Speech.' : 'Browser does not support Text-to-Speech.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(displaySummary);
    utterance.lang = activeLang === 'id' ? 'id-ID' : 'en-US';
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) =>
      activeLang === 'id'
        ? v.lang.includes('id') || v.name.toLowerCase().includes('indonesia')
        : v.lang.includes('en') || v.name.toLowerCase().includes('english')
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>{t.execSummaryTitle}</span>
            </h3>
          </div>
        </div>

        {/* Action buttons + Language Tabs for Summary */}
        <div className="flex items-center space-x-2">
          {/* Indonesian / English summary selector */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveLang('id')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold flex items-center gap-1 ${
                activeLang === 'id'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ringkasan Bahasa Indonesia"
            >
              <span>🇮🇩</span>
              <span>ID</span>
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold flex items-center gap-1 ${
                activeLang === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="English Executive Summary"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isSpeaking ? t.stopAudio : t.playAudio}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium hidden sm:inline">
              {isSpeaking ? t.stopAudio : t.playAudio}
            </span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            title={t.copy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-400">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium hidden sm:inline">{t.copy}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-3 text-slate-200 text-sm leading-relaxed">
        {displaySummary}
      </div>

      {/* Footer Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md font-medium">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>{t.confidenceLabel}: {(confidenceScore * 100).toFixed(0)}%</span>
          </div>

          {category && (
            <span className="text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md font-medium">
              {t.categoryLabel}: {category}
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          {t.verifiedDoc}: <strong className="text-slate-200">{documentType}</strong>
        </span>
      </div>
    </div>
  );
};
