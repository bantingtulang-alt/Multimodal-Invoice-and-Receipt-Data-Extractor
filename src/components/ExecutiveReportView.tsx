import React from 'react';
import { Printer, FileCheck } from 'lucide-react';
import { StrictDocumentData } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface ExecutiveReportViewProps {
  data: StrictDocumentData;
  documentTitle?: string;
  currentLang: Language;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  data,
  documentTitle,
  currentLang,
}) => {
  const t = translations[currentLang];

  const handlePrint = () => {
    window.print();
  };

  const summaryToDisplay =
    currentLang === 'en'
      ? data.summary_en || data.summary
      : data.summary;

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-3">
        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.printBarTitle}</span>
        </span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t.printBtn}</span>
        </button>
      </div>

      {/* Printable Sheet (Standard A4 / Letter styling) */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 font-sans">
        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              {t.auditReportHeader}
            </div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
              {t.verificationSheet}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Source: {documentTitle || 'Verified Business Document'} | {t.auditCode} DF-{Date.now().toString().slice(-6)}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 uppercase">
              {t.metricDocType}: {data.document_type}
            </span>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {t.analysisTime} {new Date().toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* 4 Core Parameters Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
          <div>
            <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">{t.metricDocType}</div>
            <div className="font-bold text-slate-900 mt-0.5">{data.document_type}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">{t.metricVendor}</div>
            <div className="font-bold text-slate-900 mt-0.5 truncate">{data.vendor_or_company}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">{t.metricDate}</div>
            <div className="font-bold text-slate-900 mt-0.5">{data.date || t.noDate}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">{t.metricAmount}</div>
            <div className="font-black text-emerald-700 text-sm mt-0.5 font-mono">
              {data.total_amount || 'N/A'}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-6">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>{t.execSummaryTitle}</span>
            <span className="text-[10px] font-sans text-emerald-600 font-bold">AI Verified</span>
          </h2>
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-slate-800 leading-relaxed font-normal">
            {summaryToDisplay}
          </div>
        </div>

        {/* Key Items */}
        <div className="mb-6">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            {t.itemsTitle} ({data.key_items?.length || 0})
          </h2>
          <div className="space-y-1.5 text-xs">
            {data.key_items?.map((item, index) => (
              <div key={index} className="flex items-start gap-2 py-1 border-b border-slate-100 last:border-0">
                <span className="font-mono text-slate-400 font-bold text-[11px] w-5 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-slate-800 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown if available */}
        {data.extended_details && (
          <div className="border-t border-slate-200 pt-4 mt-6">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 mb-3">
              {t.taxAndFinancialDetails}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {data.extended_details.subtotal && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono">{t.subtotalLabel}</div>
                  <div className="font-bold font-mono text-slate-900 mt-0.5">{data.extended_details.subtotal}</div>
                </div>
              )}
              {data.extended_details.tax_or_ppn && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono">{t.taxLabel}</div>
                  <div className="font-bold font-mono text-slate-900 mt-0.5">{data.extended_details.tax_or_ppn}</div>
                </div>
              )}
              {data.extended_details.payment_method && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono">{t.paymentStatusLabel}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{data.extended_details.payment_method}</div>
                </div>
              )}
              {data.extended_details.financial_category && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono">{t.categoryLabel}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{data.extended_details.financial_category}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Sign-off */}
        <div className="border-t-2 border-slate-900 pt-4 mt-8 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <div>
            <span>{t.verifiedAiSignature}</span>
          </div>
          <div>
            <span>{t.pageOf}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
