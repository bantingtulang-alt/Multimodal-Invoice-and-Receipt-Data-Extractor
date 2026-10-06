import React, { useState } from 'react';
import { Code2, Copy, Check, Download, CheckCircle2 } from 'lucide-react';
import { StrictDocumentData } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface JsonViewerProps {
  data: StrictDocumentData;
  currentLang: Language;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, currentLang }) => {
  const [copied, setCopied] = useState(false);
  const [jsonMode, setJsonMode] = useState<'strict' | 'extended'>('strict');
  const t = translations[currentLang];

  // Strict JSON payload with exactly the 6 required keys
  const strictPayload = {
    document_type: data.document_type,
    vendor_or_company: data.vendor_or_company,
    date: data.date,
    total_amount: data.total_amount,
    key_items: data.key_items,
    summary: data.summary,
  };

  const currentPayload = jsonMode === 'strict' ? strictPayload : data;
  const jsonString = JSON.stringify(currentPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `docufinance-${data.document_type.toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting for JSON
  const renderHighlightedJson = (json: string) => {
    const lines = json.split('\n');
    return lines.map((line, idx) => {
      const formattedLine = line
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?/g, (_match, p1, _offset, p3) => {
          if (p3) {
            return `<span class="text-emerald-400 font-semibold">${p1}</span><span class="text-slate-400">:</span>`;
          } else {
            return `<span class="text-amber-300">${p1}</span>`;
          }
        })
        .replace(/\b(true|false)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
        .replace(/\b(null)\b/g, '<span class="text-rose-400 font-bold">$1</span>')
        .replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, '<span class="text-purple-400">$1</span>');

      return (
        <div key={idx} className="table-row">
          <span className="table-cell select-none pr-4 text-right text-slate-600 font-mono text-[11px]">
            {idx + 1}
          </span>
          <span
            className="table-cell font-mono text-xs whitespace-pre"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.jsonTitle}</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{t.jsonVerified}</span>
              </span>
            </h3>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Strict vs Extended toggle */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setJsonMode('strict')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                jsonMode === 'strict'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.btnStrict}
            </button>
            <button
              onClick={() => setJsonMode('extended')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                jsonMode === 'extended'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.btnExtended}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title={t.btnCopyJson}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.btnCopyJson}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title={t.btnDownloadJson}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.btnDownloadJson}</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800/80 p-4 overflow-x-auto max-h-[460px] font-mono shadow-inner">
        <div className="table w-full">
          {renderHighlightedJson(jsonString)}
        </div>
      </div>

      {/* Schema Verification Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-800/60 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="text-emerald-400 font-bold">{t.jsonMandatoryNote}</span>
          <span>"document_type", "vendor_or_company", "date", "total_amount", "key_items", "summary"</span>
        </div>
        <div>
          <span>{t.payloadSizeLabel} {new Blob([jsonString]).size} bytes</span>
        </div>
      </div>
    </div>
  );
};
