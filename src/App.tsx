/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Layers, 
  Code2, 
  MessageSquare, 
  Printer, 
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  HardDrive,
  ExternalLink,
  Upload,
  Check,
  ArrowRight,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { DocumentUploader } from './components/DocumentUploader';
import { DocumentViewer } from './components/DocumentViewer';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { KeyMetricsGrid } from './components/KeyMetricsGrid';
import { KeyItemsTable } from './components/KeyItemsTable';
import { JsonViewer } from './components/JsonViewer';
import { DocumentChat } from './components/DocumentChat';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { HistoryModal } from './components/HistoryModal';
import { FormatHelpModal } from './components/FormatHelpModal';
import { SheetsDashboard } from './components/SheetsDashboard';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { StrictDocumentData, HistoryItem } from './types/document';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { INITIAL_SAMPLE_RESULT } from './data/initialSampleResult';
import { convertSvgToPngBase64 } from './utils/imageUtils';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/googleAuth';
import { getOrCreateSpreadsheet, appendDocumentToSheet } from './services/googleSheets';
import { Language, translations } from './i18n/translations';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('docufinance_lang');
      return (saved === 'en' || saved === 'id') ? saved : 'id';
    } catch {
      return 'id';
    }
  });

  const t = translations[currentLang];

  const handleToggleLang = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('docufinance_lang', lang);
    } catch {}
  };

  const [activeResultTab, setActiveResultTab] = useState<
    'dashboard' | 'sheets' | 'drive' | 'json' | 'chat' | 'report'
  >('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Google Workspace Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('docufinance_spreadsheet_id');
    } catch {
      return null;
    }
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    try {
      const id = localStorage.getItem('docufinance_spreadsheet_id');
      return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null;
    } catch {
      return null;
    }
  });

  // Sync to sheets status
  const [isSyncingToSheets, setIsSyncingToSheets] = useState(false);
  const [sheetSyncSuccess, setSheetSyncSuccess] = useState<string | null>(null);
  const [sheetSyncError, setSheetSyncError] = useState<string | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (token) {
          setGoogleAccessToken(token);
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleConnectGoogle = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleAccessToken(result.accessToken);

        // Pre-fetch or create user spreadsheet
        try {
          const sheetInfo = await getOrCreateSpreadsheet(result.accessToken);
          setSpreadsheetId(sheetInfo.spreadsheetId);
          setSpreadsheetUrl(sheetInfo.spreadsheetUrl);
        } catch (sheetErr) {
          console.warn('Initial spreadsheet setup warning:', sheetErr);
        }
      }
    } catch (err: any) {
      console.error('Google sign in failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleAccessToken(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Sync current document to Google Sheets
  const handleSyncCurrentDocToSheets = async () => {
    if (!extractedData) return;
    setIsSyncingToSheets(true);
    setSheetSyncError(null);
    setSheetSyncSuccess(null);

    try {
      let token = googleAccessToken;
      if (!token) {
        const signinRes = await googleSignIn();
        if (!signinRes) {
          throw new Error(currentLang === 'id' ? 'Otentikasi Google diperlukan.' : 'Google authentication required.');
        }
        token = signinRes.accessToken;
        setGoogleUser(signinRes.user);
        setGoogleAccessToken(token);
      }

      // Ensure spreadsheet exists
      const sheet = await getOrCreateSpreadsheet(token);
      setSpreadsheetId(sheet.spreadsheetId);
      setSpreadsheetUrl(sheet.spreadsheetUrl);

      // Append extracted document row
      const docId = `DOC-${Date.now().toString().slice(-6)}`;
      await appendDocumentToSheet(token, sheet.spreadsheetId, extractedData, docId);

      setSheetSyncSuccess(sheet.spreadsheetUrl);
    } catch (err: any) {
      console.error('Sync to Sheets error:', err);
      setSheetSyncError(
        err?.message ||
          (currentLang === 'id'
            ? 'Gagal menyinkronkan data ke Google Spreadsheet.'
            : 'Failed to sync data to Google Sheets.')
      );
    } finally {
      setIsSyncingToSheets(false);
    }
  };

  // Current active document state - initialize with rich first sample instantly
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState<string>(
    SAMPLE_DOCUMENTS[0]?.title || ''
  );
  const [currentImageBase64, setCurrentImageBase64] = useState<string | undefined>(
    SAMPLE_DOCUMENTS[0]?.imageThumbnail
  );
  const [currentMimeType, setCurrentMimeType] = useState<string | undefined>('image/svg+xml');
  const [currentRawText, setCurrentRawText] = useState<string | undefined>(
    SAMPLE_DOCUMENTS[0]?.rawText
  );
  const [extractedData, setExtractedData] = useState<StrictDocumentData | null>(
    INITIAL_SAMPLE_RESULT
  );

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // History state in localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('docufinance_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('docufinance_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  const analyzeDocument = async ({
    imageBase64,
    mimeType,
    rawText,
    title,
  }: {
    imageBase64?: string;
    mimeType?: string;
    rawText?: string;
    title: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setSheetSyncSuccess(null);
    setSheetSyncError(null);
    setCurrentDocumentTitle(title);
    setCurrentImageBase64(imageBase64);
    setCurrentMimeType(mimeType);
    setCurrentRawText(rawText);

    try {
      let payloadImageBase64 = imageBase64;
      let payloadMimeType = mimeType;

      if (imageBase64 && (mimeType === 'image/svg+xml' || imageBase64.includes('image/svg+xml'))) {
        try {
          const pngDataUrl = await convertSvgToPngBase64(imageBase64);
          if (pngDataUrl) {
            payloadImageBase64 = pngDataUrl;
            payloadMimeType = 'image/png';
          }
        } catch (convErr) {
          console.warn('SVG conversion fallback:', convErr);
        }
      }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: payloadImageBase64,
          mimeType: payloadMimeType,
          rawText,
          documentTitle: title,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || t.analysisFailed);
      }

      const result: StrictDocumentData = resData.data;
      setExtractedData(result);

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        documentTitle: title,
        imageUrl: imageBase64,
        data: result,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]); // keep last 20

      // If user is already on another view, focus on dashboard
      if (activeResultTab !== 'sheets' && activeResultTab !== 'drive') {
        setActiveResultTab('dashboard');
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || t.analysisFailed);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setExtractedData(item.data);
    setCurrentDocumentTitle(item.documentTitle);
    setCurrentImageBase64(item.imageUrl);
    setCurrentRawText(undefined);
    setActiveResultTab('dashboard');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('docufinance_history');
    } catch {}
  };

  const retryLastAnalysis = () => {
    if (currentImageBase64 || currentRawText) {
      analyzeDocument({
        imageBase64: currentImageBase64,
        mimeType: currentMimeType,
        rawText: currentRawText,
        title: currentDocumentTitle || (currentLang === 'id' ? 'Dokumen' : 'Document'),
      });
    } else if (SAMPLE_DOCUMENTS.length > 0) {
      const first = SAMPLE_DOCUMENTS[0];
      analyzeDocument({
        imageBase64: first.imageThumbnail,
        mimeType: 'image/svg+xml',
        rawText: first.rawText,
        title: first.title,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenHelp={() => setIsHelpOpen(true)}
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        user={googleUser}
        onConnectGoogle={handleConnectGoogle}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner / Instructions Brief */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold font-mono tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {t.heroTag}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {t.heroSubTag}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleToggleLang('id')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'id'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇮🇩</span>
                  <span>Bahasa Indonesia</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLang('en')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLang === 'en'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                {t.viewSchemaBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Input Zone: Document Uploader & Sample Selector */}
        <DocumentUploader
          onAnalyze={analyzeDocument}
          isAnalyzing={isAnalyzing}
          currentLang={currentLang}
          onOpenDriveTab={() => setActiveResultTab('drive')}
        />

        {/* Analysis Status / Loading Overlay */}
        {isAnalyzing && (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-8 text-center shadow-2xl animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {t.analyzingTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              {t.analyzingDesc}
            </p>
            <div className="flex justify-center items-center gap-3 text-[11px] font-mono text-emerald-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Multimodal OCR
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ID &amp; EN Bilingual
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 6 Strict Keys
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {analysisError && !isAnalyzing && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-300 text-xs">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-200">{t.analysisFailed}</h4>
                <p className="mt-0.5 leading-relaxed">{analysisError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={retryLastAnalysis}
                className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{currentLang === 'id' ? 'Coba Lagi Sekarang' : 'Retry Now'}</span>
              </button>
              <button
                onClick={() => setAnalysisError(null)}
                className="px-2.5 py-1.5 text-rose-400 hover:text-rose-200 cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        )}

        {/* Results Presentation Grid */}
        {extractedData && !isAnalyzing && (
          <div className="space-y-5">
            {/* Top Results Navigation Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
                <button
                  onClick={() => setActiveResultTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'dashboard'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{t.tabDashboard}</span>
                </button>

                {/* Google Sheets Tab */}
                <button
                  onClick={() => setActiveResultTab('sheets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'sheets'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{t.tabSheets}</span>
                </button>

                {/* Google Drive Tab */}
                <button
                  onClick={() => setActiveResultTab('drive')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'drive'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-sky-400 hover:text-sky-300'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span>{t.tabDrive}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('json')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'json'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>{t.tabStrictJson}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'chat'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.tabChat}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('report')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeResultTab === 'report'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.tabReport}</span>
                </button>
              </div>

              {/* Document Identity Tag */}
              <div className="flex items-center space-x-2 text-xs text-slate-400 pr-2">
                <span className="font-mono text-emerald-400 font-bold">
                  {extractedData.document_type}
                </span>
                <span>•</span>
                <span className="truncate max-w-[200px] text-slate-300 font-medium">
                  {extractedData.vendor_or_company}
                </span>
              </div>
            </div>

            {/* Quick Workspace Sync Action Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-300">
                  {currentLang === 'id' ? 'Aksi Integrasi Google:' : 'Google Workspace Actions:'}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {currentLang === 'id'
                    ? 'Simpan hasil ke Spreadsheet atau Arsip Drive dengan 1 klik'
                    : 'Save results to Spreadsheet or Drive Archive with 1 click'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Send to Google Sheets */}
                <button
                  onClick={handleSyncCurrentDocToSheets}
                  disabled={isSyncingToSheets}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  title={currentLang === 'id' ? 'Masukkan data ke Google Spreadsheet' : 'Sync data to Google Sheets'}
                >
                  {isSyncingToSheets ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isSyncingToSheets
                      ? currentLang === 'id' ? 'Menyinkronkan...' : 'Syncing...'
                      : t.syncToSheetsBtn}
                  </span>
                </button>

                {/* Switch to Drive */}
                <button
                  onClick={() => setActiveResultTab('drive')}
                  className="px-3.5 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>{t.saveToDriveBtn}</span>
                </button>
              </div>
            </div>

            {/* Success notification for Sheets sync */}
            {sheetSyncSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.syncedToSheetsSuccess}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={sheetSyncSuccess}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>{t.viewInSheets}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setActiveResultTab('sheets')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                  >
                    <span>{currentLang === 'id' ? 'Buka Dashboard Olah Data' : 'Open Analytics Dashboard'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Error notification for Sheets sync */}
            {sheetSyncError && (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-rose-300">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{sheetSyncError}</span>
                </div>
                <button
                  onClick={handleSyncCurrentDocToSheets}
                  className="px-2.5 py-1 bg-rose-500 text-slate-950 font-bold rounded-lg cursor-pointer text-[11px]"
                >
                  {currentLang === 'id' ? 'Coba Lagi' : 'Retry'}
                </button>
              </div>
            )}

            {/* TAB VIEW 1: Executive Dashboard (Original Dual-Column Layout) */}
            {activeResultTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
                {/* Left Column: Physical Document Viewer (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <DocumentViewer
                    imageUrl={currentImageBase64}
                    documentTitle={currentDocumentTitle}
                    rawText={currentRawText}
                  />
                </div>

                {/* Right Column: Results Panel (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Bilingual Executive Summary Card */}
                  <ExecutiveSummaryCard
                    summary={extractedData.summary}
                    summaryEn={extractedData.summary_en}
                    documentType={extractedData.document_type}
                    confidenceScore={extractedData.extended_details?.confidence_score}
                    category={extractedData.extended_details?.financial_category}
                    currentLang={currentLang}
                  />

                  {/* 4 Primary Metrics Grid */}
                  <KeyMetricsGrid
                    data={extractedData}
                    currentLang={currentLang}
                  />

                  {/* Key Items and Line Items Breakdown */}
                  <KeyItemsTable
                    data={extractedData}
                    currentLang={currentLang}
                  />
                </div>
              </div>
            )}

            {/* TAB VIEW 2: Google Sheets & Olah Data Dashboard */}
            {activeResultTab === 'sheets' && (
              <div className="animate-in fade-in duration-200">
                <SheetsDashboard
                  user={googleUser}
                  accessToken={googleAccessToken}
                  spreadsheetId={spreadsheetId}
                  spreadsheetUrl={spreadsheetUrl}
                  onConnectGoogle={handleConnectGoogle}
                  onLogout={handleLogout}
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* TAB VIEW 3: Google Drive & Archive Manager */}
            {activeResultTab === 'drive' && (
              <div className="animate-in fade-in duration-200">
                <GoogleDriveManager
                  user={googleUser}
                  accessToken={googleAccessToken}
                  currentDocumentData={extractedData}
                  currentImageBase64={currentImageBase64}
                  currentDocumentTitle={currentDocumentTitle}
                  onConnectGoogle={handleConnectGoogle}
                  onAnalyzeDocumentFromDrive={(doc) => {
                    analyzeDocument(doc);
                    setActiveResultTab('dashboard');
                  }}
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* TAB VIEW 4: Strict JSON View */}
            {activeResultTab === 'json' && (
              <div className="animate-in fade-in duration-200">
                <JsonViewer
                  data={extractedData}
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* TAB VIEW 5: Interactive Document Chat */}
            {activeResultTab === 'chat' && (
              <div className="animate-in fade-in duration-200">
                <DocumentChat
                  documentData={extractedData}
                  imageBase64={currentImageBase64}
                  mimeType={currentMimeType}
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* TAB VIEW 6: Executive Printable Report */}
            {activeResultTab === 'report' && (
              <div className="animate-in fade-in duration-200">
                <ExecutiveReportView
                  data={extractedData}
                  documentTitle={currentDocumentTitle}
                  currentLang={currentLang}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>{t.footerSystem}</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Google Sheets &amp; Drive</span>
            <span>•</span>
            <span>Bilingual (ID &amp; EN)</span>
            <span>•</span>
            <span className="text-emerald-400">Valid JSON Strict Schema</span>
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
        currentLang={currentLang}
      />

      {/* Format Help Modal */}
      <FormatHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
