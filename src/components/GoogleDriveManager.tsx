import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  FolderOpen,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  DriveFileItem,
  listDriveFiles,
  getOrCreateArchiveFolder,
  uploadJsonToDrive,
  uploadImageToDrive,
  downloadDriveFileForAnalysis,
  deleteDriveFile,
  ARCHIVE_FOLDER_NAME,
} from '../services/googleDrive';
import { StrictDocumentData } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface GoogleDriveManagerProps {
  user: User | null;
  accessToken: string | null;
  currentDocumentData: StrictDocumentData | null;
  currentImageBase64?: string;
  currentDocumentTitle?: string;
  onConnectGoogle: () => void;
  onAnalyzeDocumentFromDrive: (doc: {
    imageBase64?: string;
    mimeType?: string;
    rawText?: string;
    title: string;
  }) => void;
  currentLang: Language;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  user,
  accessToken,
  currentDocumentData,
  currentImageBase64,
  currentDocumentTitle,
  onConnectGoogle,
  onAnalyzeDocumentFromDrive,
  currentLang,
}) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDriveTab, setActiveDriveTab] = useState<'archive' | 'browse'>('archive');
  
  // Archiving current doc state
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveSuccessMsg, setArchiveSuccessMsg] = useState<{ text: string; link?: string } | null>(null);

  // Destructive deletion confirmation state (Mandatory per Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loading file for analysis
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  const t = translations[currentLang];

  const loadFolderAndFiles = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const fId = await getOrCreateArchiveFolder(accessToken);
      setFolderId(fId);

      const items = await listDriveFiles(accessToken, {
        inArchiveFolderOnly: activeDriveTab === 'archive',
        folderId: activeDriveTab === 'archive' ? fId : undefined,
        filterDocTypes: activeDriveTab === 'browse',
        searchTerm,
      });
      setFiles(items);
    } catch (err: any) {
      console.error('Drive load error:', err);
      setError(
        err?.message ||
          (currentLang === 'id'
            ? 'Gagal memuat berkas dari Google Drive.'
            : 'Failed to load files from Google Drive.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadFolderAndFiles();
    }
  }, [accessToken, activeDriveTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      loadFolderAndFiles();
    }
  };

  // Archive current document into Google Drive
  const handleArchiveCurrentDoc = async () => {
    if (!accessToken || !currentDocumentData) return;
    setIsArchiving(true);
    setError(null);
    setArchiveSuccessMsg(null);

    try {
      const targetFolderId = folderId || (await getOrCreateArchiveFolder(accessToken));
      const cleanTitle = (currentDocumentTitle || currentDocumentData.vendor_or_company || 'Document')
        .replace(/[^a-zA-Z0-9_\- ]/g, '')
        .trim();
      const datePrefix = currentDocumentData.date ? `${currentDocumentData.date.replace(/\s+/g, '-')}_` : '';
      const baseName = `${datePrefix}${cleanTitle || 'DocuFinance'}`;

      let uploadedJsonLink = '';

      // 1. Upload JSON structured data
      const jsonFile = await uploadJsonToDrive(
        accessToken,
        `${baseName}_Data.json`,
        currentDocumentData,
        targetFolderId
      );
      uploadedJsonLink = jsonFile.webViewLink || '';

      // 2. Upload image if available
      if (currentImageBase64) {
        await uploadImageToDrive(
          accessToken,
          `${baseName}_Scan.png`,
          currentImageBase64,
          'image/png',
          targetFolderId
        );
      }

      setArchiveSuccessMsg({
        text:
          currentLang === 'id'
            ? `Berhasil mengarsipkan dokumen "${baseName}" ke folder "${ARCHIVE_FOLDER_NAME}" di Google Drive!`
            : `Successfully archived "${baseName}" to "${ARCHIVE_FOLDER_NAME}" in Google Drive!`,
        link: uploadedJsonLink || `https://drive.google.com/drive/folders/${targetFolderId}`,
      });

      // Refresh list
      loadFolderAndFiles();
    } catch (err: any) {
      console.error('Archive error:', err);
      setError(
        err?.message ||
          (currentLang === 'id'
            ? 'Gagal menyimpan arsip ke Google Drive.'
            : 'Failed to archive document to Google Drive.')
      );
    } finally {
      setIsArchiving(false);
    }
  };

  // Import file from Google Drive to DocuFinance AI
  const handleImportFileFromDrive = async (file: DriveFileItem) => {
    if (!accessToken) return;
    setLoadingFileId(file.id);
    setError(null);

    try {
      const docPayload = await downloadDriveFileForAnalysis(
        accessToken,
        file.id,
        file.name,
        file.mimeType
      );

      onAnalyzeDocumentFromDrive(docPayload);
    } catch (err: any) {
      console.error('Import error:', err);
      setError(
        err?.message ||
          (currentLang === 'id'
            ? 'Gagal mengunduh berkas dari Google Drive untuk dianalisis.'
            : 'Failed to download file from Google Drive for analysis.')
      );
    } finally {
      setLoadingFileId(null);
    }
  };

  // Perform confirmed deletion (Workspace guidelines mandatory confirmation)
  const handleConfirmDelete = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(
        err?.message ||
          (currentLang === 'id'
            ? 'Gagal menghapus berkas dari Google Drive.'
            : 'Failed to delete file from Google Drive.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image/')) return <FileImage className="w-5 h-5 text-sky-400" />;
    if (mimeType.includes('json') || mimeType.includes('text')) return <FileCode className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-400" />;
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="w-5 h-5 text-teal-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  // Not signed in state
  if (!user || !accessToken) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4 text-sky-400">
          <HardDrive className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {currentLang === 'id'
            ? 'Hubungkan Google Drive untuk Arsip & Impor Dokumen'
            : 'Connect Google Drive for Document Archive & Import'}
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
          {currentLang === 'id'
            ? 'Buka dan analisis nota, kuitansi, atau faktur langsung dari akun Google Drive Anda. Simpan hasil ekstraksi JSON dan arsip foto dokumen secara otomatis ke folder aman Google Drive.'
            : 'Access and analyze receipts, invoices, or business documents directly from your Google Drive. Automatically save JSON extractions and document photos into a secure Google Drive archive folder.'}
        </p>

        {/* Standard Google Sign In Button */}
        <button
          onClick={onConnectGoogle}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {currentLang === 'id' ? 'Masuk dengan Google & Hubungkan Drive' : 'Sign in with Google & Connect Drive'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Drive Connection Status & Quick Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">
                Google Drive • {ARCHIVE_FOLDER_NAME}
              </span>
              <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terhubung</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 truncate">
              <span className="truncate">{user.email}</span>
              {folderId && (
                <a
                  href={`https://drive.google.com/drive/folders/${folderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 underline text-[11px] cursor-pointer"
                >
                  <span>{currentLang === 'id' ? 'Buka Folder di Drive' : 'Open Folder in Drive'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick Archive Current Document Action */}
        <div className="flex items-center space-x-2">
          {currentDocumentData && (
            <button
              onClick={handleArchiveCurrentDoc}
              disabled={isArchiving}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isArchiving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>
                {currentLang === 'id' ? 'Simpan Dokumen Ini ke Drive' : 'Archive Current Doc to Drive'}
              </span>
            </button>
          )}

          <button
            onClick={loadFolderAndFiles}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl transition-colors cursor-pointer"
            title="Segarkan Berkas dari Drive"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            <span className="hidden sm:inline">{currentLang === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {archiveSuccessMsg && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{archiveSuccessMsg.text}</span>
          </div>
          {archiveSuccessMsg.link && (
            <a
              href={archiveSuccessMsg.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center gap-1 text-[11px] shrink-0"
            >
              <span>{currentLang === 'id' ? 'Lihat di Drive' : 'View in Drive'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3.5 flex items-center justify-between gap-2.5 text-xs text-rose-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadFolderAndFiles}
            className="px-2.5 py-1 bg-rose-500 text-slate-950 font-bold rounded-lg cursor-pointer text-[11px]"
          >
            {currentLang === 'id' ? 'Coba Lagi' : 'Retry'}
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveDriveTab('archive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDriveTab === 'archive'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{currentLang === 'id' ? 'Folder Arsip DocuFinance' : 'DocuFinance Archive Folder'}</span>
            </button>
            <button
              onClick={() => setActiveDriveTab('browse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDriveTab === 'browse'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{currentLang === 'id' ? 'Jelajahi Berkas Drive Anda' : 'Browse Your Drive Files'}</span>
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentLang === 'id' ? 'Cari nama berkas...' : 'Search file name...'}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </form>
        </div>

        {/* Files List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
            <span>{currentLang === 'id' ? 'Memuat berkas dari Google Drive...' : 'Loading files from Google Drive...'}</span>
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <HardDrive className="w-10 h-10 mx-auto mb-2 text-slate-600 stroke-1" />
            <p className="font-semibold text-slate-300 mb-1">
              {currentLang === 'id' ? 'Belum Ada Berkas Ditemukan' : 'No Files Found'}
            </p>
            <p className="text-slate-500 max-w-sm mx-auto">
              {activeDriveTab === 'archive'
                ? currentLang === 'id'
                  ? 'Klik tombol "Simpan Dokumen Ini ke Drive" untuk membuat cadangan JSON dan foto struk/invoice ke Google Drive.'
                  : 'Click "Archive Current Doc to Drive" above to backup your extraction JSON and receipt photos to Google Drive.'
                : currentLang === 'id'
                ? 'Tidak ada berkas gambar/PDF/teks yang sesuai di akun Google Drive Anda.'
                : 'No matching image/PDF/text files in your Google Drive.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">{currentLang === 'id' ? 'Nama Berkas' : 'File Name'}</th>
                  <th className="py-2.5 px-3 font-semibold">{currentLang === 'id' ? 'Format' : 'Type'}</th>
                  <th className="py-2.5 px-3 font-semibold">{currentLang === 'id' ? 'Waktu Dibuat' : 'Created Date'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{currentLang === 'id' ? 'Aksi' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {files.map((file) => {
                  const isAnalyzingThis = loadingFileId === file.id;
                  const isImageOrPdf =
                    file.mimeType.includes('image/') ||
                    file.mimeType.includes('pdf') ||
                    file.mimeType.includes('text') ||
                    file.mimeType.includes('json');

                  return (
                    <tr key={file.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-2.5">
                        <span className="shrink-0">{getFileIcon(file.mimeType)}</span>
                        <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {file.mimeType.split('/').pop()?.toUpperCase()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {file.createdTime ? new Date(file.createdTime).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US') : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1 font-sans">
                          {/* 1-Click Import & Analyze in DocuFinance */}
                          {isImageOrPdf && (
                            <button
                              onClick={() => handleImportFileFromDrive(file)}
                              disabled={isAnalyzingThis}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                              title={currentLang === 'id' ? 'Impor dan Analisis dengan AI' : 'Import & Analyze with AI'}
                            >
                              {isAnalyzingThis ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>{currentLang === 'id' ? 'Analisis' : 'Analyze'}</span>
                            </button>
                          )}

                          {/* Open in Google Drive */}
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title={currentLang === 'id' ? 'Buka di Google Drive' : 'Open in Google Drive'}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete File - triggers explicit confirmation modal */}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title={currentLang === 'id' ? 'Hapus dari Google Drive' : 'Delete from Google Drive'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Confirmation Dialog for Destructive Deletion (Mandatory per Workspace Skill) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                {currentLang === 'id' ? 'Konfirmasi Hapus Berkas Google Drive' : 'Confirm Google Drive File Deletion'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentLang === 'id'
                ? `Apakah Anda yakin ingin menghapus berkas "${fileToDelete.name}" dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.`
                : `Are you sure you want to permanently delete "${fileToDelete.name}" from your Google Drive? This action cannot be undone.`}
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
              <div><strong className="text-slate-300">Name:</strong> {fileToDelete.name}</div>
              <div><strong className="text-slate-300">File ID:</strong> {fileToDelete.id}</div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {currentLang === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{currentLang === 'id' ? 'Hapus Berkas' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
