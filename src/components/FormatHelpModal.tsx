import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface FormatHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const FormatHelpModal: React.FC<FormatHelpModalProps> = ({ isOpen, onClose, currentLang }) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.guideTitle}</h3>
              <p className="text-xs text-slate-400">{t.guideSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
            <h4 className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> {t.mandateTitle}
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-200 mt-2">
              {t.mandateList.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">{t.sixKeysTitle}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"document_type"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Jenis dokumen, misal: "Invoice", "Receipt", "Contract", "Report".' : 'Document classification, e.g., "Invoice", "Receipt", "Contract", "Report".'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"vendor_or_company"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Nama penerbit, penjual, penyedia jasa, atau instansi pembuat dokumen.' : 'Name of issuer, merchant, service provider, or creating entity.'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"date"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Tanggal penerbitan dokumen atau transaksi jika tersedia.' : 'Date of issuance or transaction if available.'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"total_amount"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Total nominal harga jika dokumen finansial, atau null jika non-finansial.' : 'Total amount if financial document, or null if non-financial.'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"key_items"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Array daftar item pembelian atau poin-poin klausul utama dokumen.' : 'Array of purchased items or main clauses in the document.'}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">"summary"</span>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {currentLang === 'id' ? 'Ringkasan eksekutif singkat dan jelas dalam Bahasa Indonesia.' : 'Clear and concise executive summary (with summary_en for English).'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">JSON Sample:</h4>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`{
  "document_type": "Invoice",
  "vendor_or_company": "PT Solusi Cloud Indonesia",
  "date": "28 September 2024",
  "total_amount": "Rp 20.202.000",
  "key_items": [
    "Cloud Compute Enterprise Cluster (16 vCPU, 64GB RAM) 1 Bulan",
    "Managed Database PostgreSQL HA Cluster 1 Bulan",
    "DDoS Protection & Enterprise CDN (Bandwidth 10TB)"
  ],
  "summary": "Invoice tagihan infrastruktur cloud untuk PT Makmur Sentosa Abadi dengan total tagihan Rp 20.202.000 termasuk PPN 11%. Pembayaran jatuh tempo pada 15 Oktober 2024.",
  "summary_en": "Cloud infrastructure invoice for PT Makmur Sentosa Abadi totaling Rp 20,202,000 including 11% VAT. Payment due on 15 October 2024."
}`}
            </pre>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t.understandCloseBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
