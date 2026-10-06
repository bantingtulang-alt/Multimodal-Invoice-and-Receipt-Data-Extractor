import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable body parsing for large base64 document images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface DocumentAnalysisRequest {
  imageBase64?: string;
  mimeType?: string;
  rawText?: string;
  documentTitle?: string;
  additionalPrompt?: string;
}

interface StrictExtractedDocument {
  document_type: string;
  vendor_or_company: string;
  date: string | null;
  total_amount: string | null;
  key_items: string[];
  summary: string;
  summary_en?: string;
  // Extended fields for rich financial UI
  extended_details?: {
    currency?: string | null;
    invoice_or_receipt_number?: string | null;
    subtotal?: string | null;
    tax_or_ppn?: string | null;
    discount?: string | null;
    payment_method?: string | null;
    due_date?: string | null;
    customer_or_recipient?: string | null;
    confidence_score?: number;
    financial_category?: string;
    itemized_breakdown?: Array<{
      item_name: string;
      quantity?: number | string;
      unit_price?: string;
      total_price?: string;
    }>;
  };
}

const SYSTEM_INSTRUCTION = `
You are an expert AI document analyzer and financial assistant specialized in reading invoices, receipts, and professional business documents with full bilingual support (Indonesian & English).

Your tasks:
1. Accurately extract key information from the uploaded document or image.
2. Provide a clear, concise executive summary in Indonesian in the "summary" field.
3. Also provide a professional executive summary in English in the "summary_en" field.
4. Output the extracted structured data strictly in a valid JSON format with the following keys:
   - "document_type": (e.g., "Invoice", "Receipt", "Contract", "Report")
   - "vendor_or_company": (Name of the issuer)
   - "date": (Document date if available, formatted cleanly e.g. "DD MMMM YYYY" or ISO)
   - "total_amount": (Total price/amount if financial document e.g. "Rp 150.000" or "$250.00", otherwise null)
   - "key_items": [array of items or main points as strings]
   - "summary": (Short summary in Indonesian: ringkasan eksekutif yang padat, jelas, dan informatif mengenai dokumen ini, pihak yang terlibat, dan nilai/tujuan utamanya)
   - "summary_en": (Executive summary in English: concise, clear, and professional overview of the document, parties involved, and total transactional value)

Also include an optional "extended_details" object to help the financial dashboard with:
   - "currency": (e.g. "IDR", "USD", etc.)
   - "invoice_or_receipt_number": (string or null)
   - "subtotal": (string or null)
   - "tax_or_ppn": (string or null)
   - "discount": (string or null)
   - "payment_method": (e.g. "Cash", "QRIS", "Bank Transfer", "Credit Card", or null)
   - "due_date": (string or null)
   - "customer_or_recipient": (string or null)
   - "confidence_score": (number between 0.85 and 0.99)
   - "financial_category": (e.g. "Food & Beverage", "Cloud & IT Services", "Office Supplies", "Legal Agreement", "Executive Finance", "General Expense")
   - "itemized_breakdown": array of objects with keys: "item_name", "quantity", "unit_price", "total_price"

CRITICAL: Return ONLY valid, parseable JSON. Do not wrap in markdown or backticks if possible, or if wrapped in markdown code blocks, ensure the contents are strictly valid JSON.
`;

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

function processImagePayload(imageBase64?: string, mimeType?: string): {
  inlinePart?: { inlineData: { mimeType: string; data: string } };
  extractedTextFallback?: string;
} {
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return {};
  }

  const raw = imageBase64.trim();

  // If it's an SVG data URI (URL-encoded or raw SVG)
  if (raw.includes('image/svg+xml')) {
    let svgContent = '';
    try {
      if (raw.includes('base64,')) {
        const b64 = raw.split('base64,')[1];
        svgContent = Buffer.from(b64, 'base64').toString('utf8');
      } else if (raw.includes('utf8,')) {
        svgContent = decodeURIComponent(raw.split('utf8,')[1]);
      } else if (raw.startsWith('<svg')) {
        svgContent = raw;
      }
    } catch (e) {
      console.warn('Could not decode SVG text:', e);
    }

    return {
      extractedTextFallback: svgContent ? `[Isi Dokumen Vektor SVG]:\n${svgContent}` : undefined,
    };
  }

  let detectedMime = (mimeType || 'image/jpeg').toLowerCase();
  let base64Data = raw;

  // Handle data URI
  if (raw.startsWith('data:')) {
    const match = raw.match(/^data:([^;,]+)(?:;charset=[^;,]+)?(;base64)?,(.*)$/s);
    if (!match) {
      return {};
    }

    detectedMime = match[1].toLowerCase();
    const isBase64 = Boolean(match[2]);
    const payload = match[3];

    if (!isBase64) {
      return {};
    }

    base64Data = payload;
  }

  // Clean whitespaces and newlines
  const cleanBase64 = base64Data.replace(/[\r\n\s]/g, '');

  if (!cleanBase64 || !/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
    return {};
  }

  if (!SUPPORTED_MIME_TYPES.has(detectedMime)) {
    // If MIME type isn't standard, default to image/jpeg if it looks like image data
    if (detectedMime.startsWith('image/')) {
      detectedMime = 'image/jpeg';
    } else {
      return {};
    }
  }

  return {
    inlinePart: {
      inlineData: {
        mimeType: detectedMime,
        data: cleanBase64,
      },
    },
  };
}

// Resilient helper to handle transient 503 high-demand or rate-limit spikes
async function callGeminiWithRetry(options: {
  contents: any;
  config?: any;
  maxRetries?: number;
}): Promise<any> {
  // Try primary model first, then lightweight flash-lite, then latest alias
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const currentModel of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMessage = err?.message || JSON.stringify(err);
      const isTransient =
        err?.status === 'UNAVAILABLE' ||
        err?.code === 503 ||
        err?.code === 429 ||
        errMessage.includes('503') ||
        errMessage.includes('high demand') ||
        errMessage.includes('UNAVAILABLE') ||
        errMessage.includes('temporarily unavailable') ||
        errMessage.includes('RESOURCE_EXHAUSTED');

      if (isTransient) {
        // Quick backoff before trying next model
        await new Promise((resolve) => setTimeout(resolve, 800));
        continue;
      }

      // If it's a fatal validation error, throw immediately
      throw err;
    }
  }

  throw lastError;
}

// Endpoint: Analyze Document
app.post('/api/analyze-document', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, rawText, documentTitle, additionalPrompt } =
      req.body as DocumentAnalysisRequest;

    const { inlinePart, extractedTextFallback } = processImagePayload(imageBase64, mimeType);

    const effectiveText = [rawText, extractedTextFallback].filter(Boolean).join('\n\n');

    if (!inlinePart && !effectiveText) {
      return res.status(400).json({
        error: 'Harap unggah gambar dokumen valid (PNG, JPG, WebP, PDF) atau masukkan teks dokumen untuk dianalisis.',
      });
    }

    const parts: any[] = [];

    if (inlinePart) {
      parts.push(inlinePart);
    }

    let promptText = `Please analyze this business/financial document with high precision.
Extract all key details and output valid JSON strictly containing the required keys:
"document_type", "vendor_or_company", "date", "total_amount", "key_items", "summary" (in Indonesian), along with "extended_details".`;

    if (documentTitle) {
      promptText += `\nDocument context title: ${documentTitle}`;
    }

    if (effectiveText) {
      promptText += `\nDocument text content:\n${effectiveText}`;
    }

    if (additionalPrompt) {
      promptText += `\nSpecific focus requested by user: ${additionalPrompt}`;
    }

    parts.push({ text: promptText });

    const response = await callGeminiWithRetry({
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
      maxRetries: 3,
    });

    const responseText = response.text || '';
    
    // Parse JSON safely
    let parsedData: StrictExtractedDocument;
    try {
      // Clean possible code fences if any
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error from Gemini:', responseText);
      return res.status(500).json({
        error: 'Gagal memproses format JSON dari model Gemini. Silakan coba lagi.',
        raw: responseText,
      });
    }

    // Ensure strictly required fields exist
    const strictResult: StrictExtractedDocument = {
      document_type: parsedData.document_type || 'Document',
      vendor_or_company: parsedData.vendor_or_company || 'Tidak Teridentifikasi',
      date: parsedData.date ?? null,
      total_amount: parsedData.total_amount ?? null,
      key_items: Array.isArray(parsedData.key_items) ? parsedData.key_items : [],
      summary: parsedData.summary || 'Dokumen berhasil dianalisis.',
      summary_en: parsedData.summary_en || parsedData.summary || 'Document successfully analyzed.',
      extended_details: parsedData.extended_details || {},
    };

    return res.json({
      success: true,
      data: strictResult,
      rawJsonString: JSON.stringify(
        {
          document_type: strictResult.document_type,
          vendor_or_company: strictResult.vendor_or_company,
          date: strictResult.date,
          total_amount: strictResult.total_amount,
          key_items: strictResult.key_items,
          summary: strictResult.summary,
        },
        null,
        2
      ),
    });
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    const msg = error?.message || '';
    const userFriendlyMsg =
      msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')
        ? 'Layanan model Google AI sedang mengalami lonjakan antrean trafik sesaat (503 High Demand). Silakan klik tombol "Coba Lagi Sekarang" di bawah ini.'
        : msg || 'Terjadi kesalahan saat menganalisis dokumen dengan Gemini AI.';

    return res.status(500).json({
      error: userFriendlyMsg,
    });
  }
});

// Endpoint: Q&A on Document Context
app.post('/api/document-qa', async (req: Request, res: Response) => {
  try {
    const { question, documentContext, imageBase64, mimeType } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const parts: any[] = [];

    const { inlinePart, extractedTextFallback } = processImagePayload(imageBase64, mimeType);

    if (inlinePart) {
      parts.push(inlinePart);
    }

    const contextText = documentContext
      ? `Data Dokumen yang telah dianalisis:\n${JSON.stringify(documentContext, null, 2)}\n\n`
      : '';

    const textPayload = `${contextText}${extractedTextFallback ? `${extractedTextFallback}\n\n` : ''}User Question: "${question}"
Please provide an accurate, professional, and clear answer based on the document data above. Answer in Indonesian if the question is in Indonesian, or in English if the question is in English (bilingual support).`;

    parts.push({
      text: textPayload,
    });

    const response = await callGeminiWithRetry({
      contents: { parts },
      config: {
        systemInstruction:
          'You are a professional financial assistant and document analyzer. Answer questions accurately based on the document data in the language of the user question (Indonesian or English).',
      },
      maxRetries: 3,
    });

    return res.json({
      success: true,
      answer: response.text || 'Tidak dapat menemukan jawaban spesifik pada dokumen ini.',
    });
  } catch (error: any) {
    console.error('Error in document QA:', error);
    const msg = error?.message || '';
    const userFriendlyMsg =
      msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')
        ? 'Layanan AI sedang mengalami lonjakan antrean trafik sesaat (503 High Demand). Silakan coba lagi dalam beberapa detik.'
        : msg || 'Gagal memproses tanya jawab dokumen.';

    return res.status(500).json({
      error: userFriendlyMsg,
    });
  }
});

// Vite Middleware for development & Static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DocuFinance AI Server running on port ${PORT}`);
  });
}

startServer();
