import React from 'react';
import { X, History, Trash2, ArrowRight, FileBadge } from 'lucide-react';
import { HistoryItem } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  currentLang: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  currentLang,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.historyTitle}</h3>
              <p className="text-xs text-slate-400">
                {t.historySubtitle} ({history.length})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title={t.clearHistoryBtn}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearHistoryBtn}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">{t.noHistoryTitle}</p>
              <p className="text-xs mt-1">{t.noHistoryDesc}</p>
            </div>
          ) : (
            history.map((item) => {
              const summaryPreview =
                currentLang === 'en'
                  ? item.data.summary_en || item.data.summary
                  : item.data.summary;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Thumbnail"
                        className="w-12 h-14 object-cover rounded bg-white shrink-0 border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-14 rounded bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-700">
                        <FileBadge className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.data.document_type}
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          {item.data.vendor_or_company}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {summaryPreview}
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 font-mono">
                        <span>{new Date(item.timestamp).toLocaleString(currentLang === 'id' ? 'id-ID' : 'en-US')}</span>
                        {item.data.total_amount && (
                          <span className="text-emerald-400 font-bold">
                            {item.data.total_amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <span className="text-xs font-medium mr-1 hidden sm:inline">{t.openDoc}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
