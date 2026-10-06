import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  Layers, 
  Building2, 
  Calendar, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Download,
  PieChart,
  TableProperties,
  ArrowUpRight,
  LogOut,
  UserCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  SpreadsheetRecord, 
  SheetsDashboardMetrics, 
  computeDashboardMetrics, 
  fetchSpreadsheetRecords, 
  formatRupiah 
} from '../services/googleSheets';
import { Language, translations } from '../i18n/translations';

interface SheetsDashboardProps {
  user: User | null;
  accessToken: string | null;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  onConnectGoogle: () => void;
  onLogout: () => void;
  currentLang: Language;
}

export const SheetsDashboard: React.FC<SheetsDashboardProps> = ({
  user,
  accessToken,
  spreadsheetId,
  spreadsheetUrl,
  onConnectGoogle,
  onLogout,
  currentLang,
}) => {
  const [records, setRecords] = useState<SpreadsheetRecord[]>([]);
  const [metrics, setMetrics] = useState<SheetsDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const t = translations[currentLang];

  const loadData = async () => {
    if (!accessToken || !spreadsheetId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSpreadsheetRecords(accessToken, spreadsheetId);
      setRecords(data);
      setMetrics(computeDashboardMetrics(data));
    } catch (err: any) {
      console.error('Error fetching sheet records:', err);
      setError(err?.message || (currentLang === 'id' ? 'Gagal memuat data dari Google Spreadsheet.' : 'Failed to fetch data from Google Sheets.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && spreadsheetId) {
      loadData();
    }
  }, [accessToken, spreadsheetId]);

  const filteredRecords = records.filter(
    (r) =>
      r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is not authenticated yet
  if (!user || !accessToken) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {currentLang === 'id'
            ? 'Sambungkan Google Spreadsheet & Olah Data Finansial'
            : 'Connect Google Sheets & Process Financial Data'}
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
          {currentLang === 'id'
            ? 'Simpan setiap hasil ekstraksi struk & invoice otomatis ke buku kas Google Sheets. Pantau total pengeluaran, sebaran kategori, dan laporan agregat secara langsung.'
            : 'Automatically save every extracted receipt & invoice into your Google Sheets ledger. Monitor total expenses, category breakdowns, and aggregate reports in real time.'}
        </p>

        {/* Official Google Sign in button style */}
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
            {currentLang === 'id' ? 'Masuk dengan Google & Hubungkan Sheets' : 'Sign in with Google & Connect Sheets'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Google Sheets Header & Connection Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">
                DocuFinance AI - Buku Kas &amp; Arsip
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terhubung</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 truncate">
              <span className="truncate">{user.email}</span>
              {spreadsheetId && (
                <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
                  (ID: {spreadsheetId.slice(0, 10)}...)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>{currentLang === 'id' ? 'Buka di Google Sheets' : 'Open in Google Sheets'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl transition-colors cursor-pointer"
            title="Segarkan Data dari Spreadsheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{currentLang === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title={currentLang === 'id' ? 'Putuskan Akun Google' : 'Disconnect Google Account'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <div className="flex-1">{error}</div>
          <button
            onClick={loadData}
            className="px-2.5 py-1 bg-rose-500 text-slate-950 font-bold rounded-lg cursor-pointer text-[11px]"
          >
            {currentLang === 'id' ? 'Coba Lagi' : 'Retry'}
          </button>
        </div>
      )}

      {/* Processed Analytics Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Pengeluaran */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'id' ? 'Total Pengeluaran Tercatat' : 'Total Expenses Recorded'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 tracking-tight">
            {metrics ? metrics.totalExpenseFormatted : 'Rp 0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currentLang === 'id' ? 'Akumulasi seluruh dokumen di Sheets' : 'Accumulated from Google Sheets'}
          </div>
        </div>

        {/* Metric 2: Total Transaksi / Baris */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'id' ? 'Jumlah Dokumen Masuk' : 'Total Documents Logged'}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <TableProperties className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
            {metrics ? metrics.totalRecords : 0} <span className="text-xs text-slate-400 font-sans font-normal">{currentLang === 'id' ? 'Dokumen' : 'Docs'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currentLang === 'id' ? 'Baris data pada tab "Ringkasan"' : 'Rows in "Ringkasan Dokumen" sheet'}
          </div>
        </div>

        {/* Metric 3: Kategori Teratas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'id' ? 'Kategori Terbanyak' : 'Top Category'}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-white truncate">
            {metrics && Object.keys(metrics.categoryBreakdown).length > 0
              ? Object.entries(metrics.categoryBreakdown).sort((a, b) => b[1] - a[1])[0][0]
              : '-'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currentLang === 'id' ? 'Pusat alokasi anggaran belanja' : 'Primary budget allocation'}
          </div>
        </div>

        {/* Metric 4: Rasio Invoice vs Struk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentLang === 'id' ? 'Komposisi Dokumen' : 'Document Mix'}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-mono text-slate-200 space-y-0.5">
            {metrics && Object.entries(metrics.typeBreakdown).length > 0 ? (
              Object.entries(metrics.typeBreakdown).slice(0, 2).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-slate-400">{type}:</span>
                  <span className="font-bold text-emerald-400">{count}x</span>
                </div>
              ))
            ) : (
              <span>Belum ada data</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      {metrics && Object.keys(metrics.categoryBreakdown).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-300 mb-3 flex items-center justify-between">
            <span>{currentLang === 'id' ? 'Distribusi Pengeluaran per Kategori' : 'Expense Distribution by Category'}</span>
            <span className="text-[10px] text-slate-500">{currentLang === 'id' ? 'Dihitung otomatis dari Google Sheets' : 'Computed from Google Sheets'}</span>
          </h4>
          <div className="space-y-2.5">
            {Object.entries(metrics.categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const percent = metrics.totalExpenseNumeric > 0
                  ? Math.round((amount / metrics.totalExpenseNumeric) * 100)
                  : 0;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-200">{cat}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {formatRupiah(amount)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Live Google Sheets Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentLang === 'id' ? 'Buku Kas & Arsip Transaksi dari Google Sheets' : 'Transaction Ledger from Google Sheets'}</span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {records.length} {currentLang === 'id' ? 'Baris' : 'Rows'}
              </span>
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={currentLang === 'id' ? 'Cari penerbit / kategori...' : 'Search vendor / category...'}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-52"
              />
            </div>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
            <p className="font-semibold text-slate-400">
              {currentLang === 'id' ? 'Belum ada data di Google Spreadsheet ini.' : 'No data recorded in this Google Spreadsheet yet.'}
            </p>
            <p className="mt-1">
              {currentLang === 'id'
                ? 'Pindai dokumen atau pilih sampel, lalu klik tombol "Kirim ke Google Spreadsheet".'
                : 'Scan a document or pick a sample, then click "Send to Google Spreadsheet".'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">{currentLang === 'id' ? 'Tanggal' : 'Date'}</th>
                  <th className="py-2.5 px-3">{currentLang === 'id' ? 'Penerbit / Vendor' : 'Vendor'}</th>
                  <th className="py-2.5 px-3">{currentLang === 'id' ? 'Jenis' : 'Type'}</th>
                  <th className="py-2.5 px-3">{currentLang === 'id' ? 'Kategori' : 'Category'}</th>
                  <th className="py-2.5 px-3 text-right">{currentLang === 'id' ? 'Total Nominal' : 'Amount'}</th>
                  <th className="py-2.5 px-3">{currentLang === 'id' ? 'Ringkasan' : 'Summary'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredRecords.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{row.id}</td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{row.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">{row.vendor}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {row.documentType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{row.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {row.totalAmountStr}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate" title={row.summary}>
                      {row.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
