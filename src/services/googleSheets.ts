import { StrictDocumentData } from '../types/document';

export interface SpreadsheetRecord {
  id: string;
  date: string;
  documentType: string;
  vendor: string;
  totalAmountStr: string;
  numericAmount: number;
  category: string;
  paymentMethod: string;
  tax: string;
  subtotal: string;
  keyPoints: string;
  summary: string;
  extractedAt: string;
}

export interface SheetsDashboardMetrics {
  totalRecords: number;
  totalExpenseNumeric: number;
  totalExpenseFormatted: string;
  categoryBreakdown: { [category: string]: number };
  typeBreakdown: { [type: string]: number };
  recentRecords: SpreadsheetRecord[];
}

export function parseIndonesianCurrency(val?: string | null): number {
  if (!val) return 0;
  // Strip "Rp", "IDR", "$", dots, commas, spaces
  const clean = val.replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

export async function getOrCreateSpreadsheet(accessToken: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
}> {
  const savedId = localStorage.getItem('docufinance_spreadsheet_id');

  if (savedId) {
    try {
      // Verify spreadsheet exists and is accessible
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${savedId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (checkRes.ok) {
        return {
          spreadsheetId: savedId,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${savedId}/edit`,
        };
      }
    } catch {
      // Fall through to create new spreadsheet if deleted or inaccessible
    }
  }

  // Create brand new Google Spreadsheet
  const createPayload = {
    properties: {
      title: 'DocuFinance AI - Buku Kas & Arsip Keuangan',
    },
    sheets: [
      {
        properties: {
          title: 'Ringkasan Dokumen',
          gridProperties: { rowCount: 1000, columnCount: 15 },
        },
      },
      {
        properties: {
          title: 'Rincian Item',
          gridProperties: { rowCount: 1000, columnCount: 10 },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(errData.error?.message || 'Gagal membuat Google Spreadsheet baru.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Set up header rows in both sheets
  const headersMain = [
    'ID Dokumen',
    'Tanggal Dokumen',
    'Jenis Dokumen',
    'Penerbit / Vendor',
    'Total Nominal',
    'Kategori Finansial',
    'Metode Pembayaran',
    'Pajak (PPN/PB1)',
    'Subtotal',
    'Item Kunci',
    'Ringkasan Eksekutif',
    'Waktu Analisis',
  ];

  const headersItems = [
    'ID Dokumen',
    'Tanggal',
    'Penerbit / Vendor',
    'Nama Produk / Layanan',
    'Kuantitas',
    'Harga Satuan',
    'Total Harga',
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Ringkasan Dokumen!A1:L1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [headersMain] }),
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rincian Item!A1:G1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [headersItems] }),
  });

  localStorage.setItem('docufinance_spreadsheet_id', spreadsheetId);

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

export async function appendDocumentToSheet(
  accessToken: string,
  spreadsheetId: string,
  data: StrictDocumentData,
  docId: string = `DOC-${Date.now().toString().slice(-6)}`
): Promise<{ success: boolean; spreadsheetUrl: string }> {
  const timestamp = new Date().toLocaleString('id-ID');
  const itemsText = (data.key_items || []).join('; ');

  const mainRow = [
    docId,
    data.date || '-',
    data.document_type || 'Document',
    data.vendor_or_company || '-',
    data.total_amount || '-',
    data.extended_details?.financial_category || 'Umum',
    data.extended_details?.payment_method || '-',
    data.extended_details?.tax_or_ppn || '-',
    data.extended_details?.subtotal || '-',
    itemsText,
    data.summary || '-',
    timestamp,
  ];

  // Append to Main Sheet
  const appendMainRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Ringkasan Dokumen!A:L:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [mainRow] }),
    }
  );

  if (!appendMainRes.ok) {
    const err = await appendMainRes.json();
    throw new Error(err.error?.message || 'Gagal menambahkan baris ke Google Spreadsheet.');
  }

  // If itemized items exist, append them to Item Breakdown sheet
  const breakdown = data.extended_details?.itemized_breakdown || [];
  if (breakdown.length > 0) {
    const itemRows = breakdown.map((item) => [
      docId,
      data.date || '-',
      data.vendor_or_company || '-',
      item.item_name || '-',
      item.quantity || 1,
      item.unit_price || '-',
      item.total_price || '-',
    ]);

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rincian Item!A:G:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: itemRows }),
      }
    );
  }

  return {
    success: true,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

export async function fetchSpreadsheetRecords(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetRecord[]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Ringkasan Dokumen!A2:L1000`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal mengambil data dari Google Spreadsheet.');
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows.map((row, idx) => {
    const totalAmountStr = row[4] || '-';
    const num = parseIndonesianCurrency(totalAmountStr);

    return {
      id: row[0] || `REC-${idx + 1}`,
      date: row[1] || '-',
      documentType: row[2] || 'Document',
      vendor: row[3] || 'Vendor',
      totalAmountStr,
      numericAmount: num,
      category: row[5] || 'Umum',
      paymentMethod: row[6] || '-',
      tax: row[7] || '-',
      subtotal: row[8] || '-',
      keyPoints: row[9] || '-',
      summary: row[10] || '-',
      extractedAt: row[11] || '-',
    };
  });
}

export function computeDashboardMetrics(records: SpreadsheetRecord[]): SheetsDashboardMetrics {
  let totalExpenseNumeric = 0;
  const categoryBreakdown: { [category: string]: number } = {};
  const typeBreakdown: { [type: string]: number } = {};

  records.forEach((rec) => {
    totalExpenseNumeric += rec.numericAmount;

    const cat = rec.category || 'Umum';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + rec.numericAmount;

    const dt = rec.documentType || 'Document';
    typeBreakdown[dt] = (typeBreakdown[dt] || 0) + 1;
  });

  return {
    totalRecords: records.length,
    totalExpenseNumeric,
    totalExpenseFormatted: formatRupiah(totalExpenseNumeric),
    categoryBreakdown,
    typeBreakdown,
    recentRecords: [...records].reverse(),
  };
}
