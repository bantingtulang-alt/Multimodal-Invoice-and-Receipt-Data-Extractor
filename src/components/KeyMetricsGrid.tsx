import React from 'react';
import { 
  Building2, 
  Calendar, 
  Coins, 
  FileBadge, 
  CreditCard, 
  Clock, 
} from 'lucide-react';
import { StrictDocumentData } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface KeyMetricsGridProps {
  data: StrictDocumentData;
  currentLang: Language;
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ data, currentLang }) => {
  const { document_type, vendor_or_company, date, total_amount, extended_details } = data;
  const t = translations[currentLang];

  const getTypeColor = (type: string) => {
    const s = type.toLowerCase();
    if (s.includes('receipt') || s.includes('struk') || s.includes('nota')) {
      return {
        bg: 'from-amber-500/10 to-amber-600/5',
        border: 'border-amber-500/30',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: 'text-amber-400',
      };
    }
    if (s.includes('invoice') || s.includes('tagihan') || s.includes('faktur')) {
      return {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30',
        badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        icon: 'text-blue-400',
      };
    }
    if (s.includes('contract') || s.includes('perjanjian') || s.includes('spk')) {
      return {
        bg: 'from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        icon: 'text-purple-400',
      };
    }
    return {
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: 'text-emerald-400',
    };
  };

  const style = getTypeColor(document_type);

  return (
    <div className="space-y-3">
      {/* 4 Primary Mandated Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Document Type */}
        <div className={`bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-4 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {t.metricDocType}
            </span>
            <div className={`p-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 ${style.icon}`}>
              <FileBadge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className={`inline-block font-mono font-bold text-sm px-2.5 py-1 rounded-lg border ${style.badgeBg}`}>
              {document_type || t.unknownType}
            </span>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              {extended_details?.invoice_or_receipt_number ? (
                <span>No: <strong className="text-slate-300">{extended_details.invoice_or_receipt_number}</strong></span>
              ) : (
                <span>{t.verifiedClass}</span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Vendor or Company */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {t.metricVendor}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h4 className="text-base font-bold text-white truncate" title={vendor_or_company}>
              {vendor_or_company || t.unknownType}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {extended_details?.customer_or_recipient ? (
                <span>To: {extended_details.customer_or_recipient}</span>
              ) : (
                <span>{t.officialIssuer}</span>
              )}
            </p>
          </div>
        </div>

        {/* Metric 3: Date */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {t.metricDate}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h4 className="text-base font-bold text-white truncate">
              {date || t.noDate}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>
                {extended_details?.due_date
                  ? `${t.dueDateLabel} ${extended_details.due_date}`
                  : t.issueDateLabel}
              </span>
            </p>
          </div>
        </div>

        {/* Metric 4: Total Amount */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 relative overflow-hidden shadow-lg shadow-emerald-500/5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
              {t.metricAmount}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <h4 className="text-xl sm:text-2xl font-black font-mono text-emerald-300 tracking-tight">
              {total_amount || t.nonFinancial}
            </h4>
            <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center justify-between">
              <span>{extended_details?.payment_method ? `${t.paymentMethodLabel} ${extended_details.payment_method}` : t.finalTotal}</span>
              {extended_details?.currency && (
                <span className="font-mono font-bold bg-emerald-900/40 px-1.5 py-0.5 rounded text-[10px]">
                  {extended_details.currency}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Financial Badges (If Available) */}
      {extended_details && (extended_details.subtotal || extended_details.tax_or_ppn || extended_details.discount) && (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            {extended_details.subtotal && (
              <div>
                <span className="text-slate-500 mr-1.5">{t.subtotalLabel}</span>
                <span className="font-mono font-semibold text-slate-200">{extended_details.subtotal}</span>
              </div>
            )}
            {extended_details.tax_or_ppn && (
              <div>
                <span className="text-slate-500 mr-1.5">{t.taxLabel}</span>
                <span className="font-mono font-semibold text-amber-300">{extended_details.tax_or_ppn}</span>
              </div>
            )}
            {extended_details.discount && (
              <div>
                <span className="text-slate-500 mr-1.5">{t.discountLabel}</span>
                <span className="font-mono font-semibold text-emerald-400">{extended_details.discount}</span>
              </div>
            )}
            {extended_details.payment_method && (
              <div>
                <span className="text-slate-500 mr-1.5">{t.paymentStatusLabel}</span>
                <span className="font-semibold text-cyan-300">{extended_details.payment_method}</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {t.verifiedDetails}
          </div>
        </div>
      )}
    </div>
  );
};
