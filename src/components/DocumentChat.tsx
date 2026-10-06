import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { StrictDocumentData } from '../types/document';
import { convertSvgToPngBase64 } from '../utils/imageUtils';
import { Language, translations } from '../i18n/translations';

interface DocumentChatProps {
  documentData: StrictDocumentData;
  imageBase64?: string;
  mimeType?: string;
  currentLang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({
  documentData,
  imageBase64,
  mimeType,
  currentLang,
}) => {
  const t = translations[currentLang];

  const getInitialWelcome = (lang: Language) => {
    return lang === 'id'
      ? `Halo! Saya asisten finansial AI Anda. Saya telah membaca dokumen **${documentData.vendor_or_company}** (${documentData.document_type}). Anda bisa menanyakan apa pun terkait rincian biaya, pajak PPN/PB1, kelayakan reimbursement, atau tenggat waktu pembayaran.`
      : `Hello! I am your AI financial assistant. I have reviewed **${documentData.vendor_or_company}** (${documentData.document_type}). Feel free to ask about tax breakdowns, reimbursement eligibility, payment terms, or itemized calculations.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: getInitialWelcome(currentLang),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Update initial message if empty
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: getInitialWelcome(currentLang),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentLang]);

  const suggestedQuestions = currentLang === 'id'
    ? [
        'Apakah ini sah untuk klaim reimburse kantor?',
        'Berapa rincian pajak (PPN/PB1) yang dikenakan?',
        'Kapan batas waktu pembayaran tagihan ini?',
        'Rangkum item dengan nominal pengeluaran terbesar',
      ]
    : [
        'Is this receipt valid for corporate reimbursement?',
        'What is the detailed tax/VAT amount charged?',
        'When is the due date for payment?',
        'Which line item represents the largest expense?',
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      let payloadImageBase64 = imageBase64;
      let payloadMimeType = mimeType;

      if (imageBase64 && (mimeType === 'image/svg+xml' || imageBase64.includes('image/svg+xml'))) {
        try {
          const pngDataUrl = await convertSvgToPngBase64(imageBase64);
          if (pngDataUrl) {
            payloadImageBase64 = pngDataUrl;
            payloadMimeType = 'image/png';
          }
        } catch (convErr) {
          console.warn('SVG conversion fallback in chat:', convErr);
        }
      }

      const response = await fetch('/api/document-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          documentContext: documentData,
          imageBase64: payloadImageBase64,
          mimeType: payloadMimeType,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || (currentLang === 'id' ? 'Gagal memperoleh jawaban AI.' : 'Failed to retrieve AI answer.'));
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: resData.answer || (currentLang === 'id' ? 'Maaf, saya tidak dapat menemukan informasi tersebut pada dokumen ini.' : 'Sorry, could not find that information in this document.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `Error: ${err.message || 'Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.chatTitle}</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800/40 px-2 py-0.5 rounded-full font-mono">
                {t.interactiveBadge}
              </span>
            </h3>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {t.chatContextLabel} {documentData.vendor_or_company}
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="shrink-0 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/40 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 font-medium'
                  : 'bg-slate-950 text-slate-200 border border-slate-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-[9px] text-slate-500 mt-1 text-right font-mono">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>{t.analyzingQuestion}</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.chatPlaceholder}
          disabled={loading}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.sendBtn}</span>
        </button>
      </form>
    </div>
  );
};
