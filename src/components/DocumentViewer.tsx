import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Eye } from 'lucide-react';

interface DocumentViewerProps {
  imageUrl?: string;
  documentTitle?: string;
  rawText?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  imageUrl,
  documentTitle,
  rawText,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl transition-all ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-slate-950/95 backdrop-blur-xl border-emerald-500/40 shadow-2xl'
          : 'h-[520px]'
      }`}
    >
      {/* Header bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 truncate">
          <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            {documentTitle || 'Tampilan Fisik Dokumen'}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
            title="Putar 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
            title="Kembalikan Tampilan"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 bg-slate-950/80 overflow-auto p-4 flex items-center justify-center relative select-none">
        {imageUrl ? (
          <div
            className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt={documentTitle || 'Dokumen'}
              className="max-h-[460px] w-auto max-w-full rounded shadow-2xl object-contain border border-slate-700/50 bg-white"
            />
          </div>
        ) : rawText ? (
          <div className="w-full h-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-y-auto">
            <div className="text-[11px] font-mono text-emerald-400 mb-2 font-semibold">
              --- TEKS DOKUMEN ASLI ---
            </div>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {rawText}
            </pre>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs">
            Tidak ada dokumen aktif untuk ditampilkan.
          </div>
        )}
      </div>
    </div>
  );
};
