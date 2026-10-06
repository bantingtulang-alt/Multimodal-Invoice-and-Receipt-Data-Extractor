import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Camera, 
  FileText, 
  Sparkles, 
  RotateCw, 
  AlertCircle,
  ScanLine,
  HardDrive
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { SampleDocument } from '../types/document';
import { Language, translations } from '../i18n/translations';

interface DocumentUploaderProps {
  onAnalyze: (fileData: { imageBase64?: string; mimeType?: string; rawText?: string; title: string }) => void;
  isAnalyzing: boolean;
  currentLang: Language;
  onOpenDriveTab?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onAnalyze,
  isAnalyzing,
  currentLang,
  onOpenDriveTab,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'samples' | 'text'>('samples');
  const [dragOver, setDragOver] = useState(false);
  const [customText, setCustomText] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const t = translations[currentLang];
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // prefer back camera on phones/tablets
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError(t.cameraError);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onAnalyze({
      imageBase64: dataUrl,
      mimeType: 'image/jpeg',
      title: currentLang === 'id' ? 'Foto Struk/Dokumen Langsung (Kamera)' : 'Direct Camera Snapshot',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert(currentLang === 'id' ? 'Silakan pilih berkas gambar (JPG, PNG, WebP) atau PDF.' : 'Please select an image file (JPG, PNG, WebP) or PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onAnalyze({
        imageBase64: base64,
        mimeType: file.type || 'image/jpeg',
        title: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          return;
        }
      }
    }
  };

  const handleSelectSample = (sample: SampleDocument) => {
    onAnalyze({
      imageBase64: sample.imageThumbnail,
      mimeType: 'image/svg+xml',
      rawText: sample.rawText,
      title: sample.title,
    });
  };

  const handleAnalyzeText = () => {
    if (!customText.trim()) return;
    onAnalyze({
      rawText: customText.trim(),
      title: currentLang === 'id' ? 'Dokumen Teks / Transkrip Keuangan' : 'Document Text Transcript',
    });
  };

  return (
    <div 
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden"
      onPaste={handlePaste}
    >
      {/* Top Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-emerald-400" />
            <span>{t.uploaderTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.uploaderSubtitle}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('samples');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabSamples}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{t.tabUpload}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.tabCamera}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('text');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'text'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabText}</span>
          </button>

          {onOpenDriveTab && (
            <button
              onClick={() => {
                stopCamera();
                onOpenDriveTab();
              }}
              className="px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-sky-400 hover:text-sky-300 hover:bg-slate-800/80 border border-sky-500/30"
              title={currentLang === 'id' ? 'Buka & Impor dari Google Drive' : 'Open & Import from Google Drive'}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Samples Gallery */}
      {activeTab === 'samples' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>{t.sampleHeader}</span>
            </span>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
              {t.sampleBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                disabled={isAnalyzing}
                className="group text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/50 rounded-xl p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-500/5 relative overflow-hidden"
              >
                <div className="w-full aspect-[4/5] bg-white rounded-lg overflow-hidden mb-2.5 border border-slate-700/40 shadow-inner relative flex items-center justify-center p-1">
                  <img
                    src={sample.imageThumbnail}
                    alt={sample.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="text-[11px] font-bold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {t.sampleAnalyzeBtn}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        sample.category === 'Receipt'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : sample.category === 'Invoice'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : sample.category === 'Contract'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {sample.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-200">
                      {sample.amount}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {currentLang === 'en' ? sample.titleEn || sample.title : sample.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {currentLang === 'en' ? sample.descriptionEn || sample.description : sample.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Upload File */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
              : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-md">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
            {t.dropTitle}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            {t.dropDesc}
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md shadow-emerald-500/20"
          >
            {t.browseBtn}
          </button>
        </div>
      )}

      {/* Tab 3: Camera */}
      {activeTab === 'camera' && (
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
          {cameraError ? (
            <div className="py-8 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-3">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
              >
                {t.retryCameraBtn}
              </button>
            </div>
          ) : (
            <div className="relative max-w-md mx-auto overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-72 sm:h-80 object-cover"
              />
              {/* Receipt alignment guide overlay */}
              <div className="absolute inset-4 border-2 border-emerald-400/40 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                  <span>{t.cameraAreaText}</span>
                  <span>{t.cameraFocusText}</span>
                </div>
                <div className="text-[10px] text-emerald-300/80 text-center font-medium bg-slate-950/60 py-1 rounded">
                  {t.cameraHint}
                </div>
              </div>

              {/* Action bar below video */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  {t.closeCameraBtn}
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition-transform active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.captureBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  title="Reload Camera"
                  className="p-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Raw Text */}
      {activeTab === 'text' && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {t.textLabel}
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={t.textPlaceholder}
            rows={6}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAnalyzeText}
              disabled={!customText.trim() || isAnalyzing}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.analyzeTextBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
