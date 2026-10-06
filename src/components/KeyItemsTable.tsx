import React, { useState } from 'react';
import { ListFilter, Search, Download } from 'lucide-react';
import { StrictDocumentData } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface KeyItemsTableProps {
  data: StrictDocumentData;
  currentLang: Language;
}

export const KeyItemsTable: React.FC<KeyItemsTableProps> = ({ data, currentLang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'breakdown'>('all');
  const t = translations[currentLang];

  const keyItems = data.key_items || [];
  const breakdown = data.extended_details?.itemized_breakdown || [];

  const filteredKeyItems = keyItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBreakdown = breakdown.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.total_price && item.total_price.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (breakdown.length > 0) {
      csvContent += `${t.thNo},${t.thDesc},${t.thQty},${t.thUnitPrice},${t.thTotal}\n`;
      breakdown.forEach((item, index) => {
        csvContent += `"${index + 1}","${item.item_name.replace(/"/g, '""')}","${item.quantity || 1}","${item.unit_price || '-'}","${item.total_price || '-'}"\n`;
      });
    } else {
      csvContent += `${t.thNo},${t.btnKeyPoints}\n`;
      keyItems.forEach((item, index) => {
        csvContent += `"${index + 1}","${item.replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `docufinance-items-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ListFilter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.itemsTitle}</span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {keyItems.length} {t.itemsFoundSuffix}
              </span>
            </h3>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2">
          {breakdown.length > 0 && (
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.btnKeyPoints}
              </button>
              <button
                onClick={() => setViewMode('breakdown')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'breakdown'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.btnBreakdown} ({breakdown.length})
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-32 sm:w-44"
            />
          </div>

          <button
            onClick={exportCsv}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-1"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Breakdown Table (if available and selected) */}
      {viewMode === 'breakdown' && breakdown.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{t.thNo}</th>
                <th className="py-2.5 px-3">{t.thDesc}</th>
                <th className="py-2.5 px-3 text-center">{t.thQty}</th>
                <th className="py-2.5 px-3 text-right">{t.thUnitPrice}</th>
                <th className="py-2.5 px-3 text-right">{t.thTotal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredBreakdown.length > 0 ? (
                filteredBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{row.item_name}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                      {row.quantity ?? 1}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {row.unit_price || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {row.total_price || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    {t.noItemsFound} "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mode 2: Strict "key_items" Array List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredKeyItems.length > 0 ? (
            filteredKeyItems.map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 hover:border-emerald-500/40 rounded-xl p-3 flex items-start space-x-3 transition-colors group"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400 group-hover:bg-emerald-500/20">
                  <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 text-xs text-slate-200 leading-relaxed font-sans">
                  {item}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-6 text-center text-slate-500 text-xs">
              {searchTerm
                ? `${t.noItemsFound} "${searchTerm}".`
                : 'No items detected.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
