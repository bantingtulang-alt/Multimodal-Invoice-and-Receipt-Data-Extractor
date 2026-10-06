export type Language = 'id' | 'en';

export const translations = {
  id: {
    appTitle: 'DocuFinance AI',
    appSubtitle: 'Analis Dokumen & Asisten Finansial AI',
    onlineBadge: 'Gemini 3.8 Flash Online',
    historyBtn: 'Riwayat',
    formatGuideBtn: 'Format Spesifikasi',
    strictJsonBadge: 'Strict JSON Output',

    // Hero
    heroTag: 'AI Document & Financial Assistant',
    heroSubTag: 'Ekstraksi Presisi • Ringkasan Dwibahasa • Format JSON Valid',
    heroTitle: 'Pindai Struk, Tagihan, dan Dokumen Bisnis dengan AI',
    heroDesc: 'Membaca dan mengekstrak jenis dokumen, penerbit (vendor/perusahaan), tanggal, total nominal, serta item kunci ke dalam skema JSON baku disertai ringkasan eksekutif.',
    viewSchemaBtn: 'Lihat Skema JSON Wajib',

    // Uploader
    uploaderTitle: 'Pilih atau Unggah Dokumen',
    uploaderSubtitle: 'Mendukung Struk (Receipt), Tagihan (Invoice), Kontrak (Contract), dan Laporan (Report)',
    tabSamples: 'Contoh Siap Pakai',
    tabUpload: 'Unggah Berkas',
    tabCamera: 'Kamera',
    tabText: 'Teks OCR',

    // Samples
    sampleHeader: '5 Dokumen Sampel Nyata (Klik untuk Analisis Langsung):',
    sampleBadge: '1-Klik Siap Uji',
    sampleAnalyzeBtn: 'Analisis Dokumen',

    // Upload zone
    dropTitle: 'Tarik & Letakkan Foto Dokumen Anda ke Sini',
    dropDesc: 'Mendukung gambar struk belanja, invoice digital, foto tagihan, kontrak bisnis (PNG, JPG, WebP). Anda juga dapat menempelkan langsung (Ctrl+V).',
    browseBtn: 'Pilih Berkas dari Perangkat',

    // Camera
    cameraAreaText: '[AREA STRUK]',
    cameraFocusText: 'FOKUS TEKS',
    cameraHint: 'Posisikan dokumen dalam bingkai & pastikan pencahayaan terang',
    closeCameraBtn: 'Tutup Kamera',
    captureBtn: 'Ambil Foto & Analisis',
    cameraError: 'Gagal mengakses kamera. Pastikan izin kamera telah diberikan di peramban Anda.',
    retryCameraBtn: 'Coba Akses Kamera Lagi',

    // Text OCR
    textLabel: 'Tempelkan Teks Isi Dokumen, Nota, atau Transkrip Laporan Keuangan:',
    textPlaceholder: 'Contoh:\nFAKTUR PENJUALAN TOKO ELEKTRONIK JAYA\nTanggal: 05 Oktober 2024\nNo. Inv: INV-88219\nItem: Monitor LED 24 Inch x 2 @ Rp 1.500.000 = Rp 3.000.000\nSubtotal: Rp 3.000.000\nPPN 11%: Rp 330.000\nTotal: Rp 3.330.000',
    analyzeTextBtn: 'Analisis Teks Dokumen Sekarang',

    // Status
    analyzingTitle: 'Gemini AI Sedang Menganalisis Dokumen...',
    analyzingDesc: 'Mengekstrak jenis dokumen, nama penerbit, tanggal, total finansial, daftar item, dan menyusun ringkasan eksekutif.',
    analysisFailed: 'Gagal Memproses Dokumen',
    closeBtn: 'Tutup',

    // Tabs
    tabDashboard: 'Dashboard Eksekutif',
    tabSheets: 'Google Sheets & Olah Data',
    tabDrive: 'Google Drive & Arsip',
    tabStrictJson: 'Strict JSON (6 Kunci)',
    tabChat: 'Tanya Dokumen',
    tabReport: 'Laporan Cetak',

    // Workspace Actions
    syncToSheetsBtn: 'Kirim ke Google Sheets',
    saveToDriveBtn: 'Simpan ke Google Drive',
    syncedToSheetsSuccess: 'Berhasil dimasukkan ke Google Spreadsheet!',
    viewInSheets: 'Buka di Google Sheets',

    // Summary Card
    execSummaryTitle: 'Ringkasan Eksekutif (Executive Summary)',
    playAudio: 'Putar Audio',
    stopAudio: 'Berhenti',
    copy: 'Salin',
    copied: 'Tersalin!',
    confidenceLabel: 'Tingkat Keyakinan AI',
    categoryLabel: 'Kategori',
    verifiedDoc: 'Dokumen Terverifikasi',

    // Summary Language Switcher in Card
    summaryLangTitle: 'Bahasa Ringkasan:',
    summaryLangId: 'Indonesia',
    summaryLangEn: 'Inggris',

    // Metrics
    metricDocType: '1. Document Type',
    metricVendor: '2. Vendor / Company',
    metricDate: '3. Date (Tanggal)',
    metricAmount: '4. Total Amount (Nominal)',
    unknownType: 'Tidak Teridentifikasi',
    verifiedClass: 'Klasifikasi dokumen terverifikasi',
    officialIssuer: 'Pihak Penerbit Resmi',
    noDate: 'Tidak Tersedia',
    dueDateLabel: 'Jatuh tempo:',
    issueDateLabel: 'Waktu penerbitan dokumen',
    nonFinancial: 'null (Non-Finansial)',
    finalTotal: 'Total Akhir Tagihan',
    paymentMethodLabel: 'Metode:',
    subtotalLabel: 'Subtotal / DPP:',
    taxLabel: 'Pajak (PPN / PB1):',
    discountLabel: 'Diskon / Potongan:',
    paymentStatusLabel: 'Status Pembayaran:',
    verifiedDetails: 'Rincian Finansial Terverifikasi',

    // Items Table
    itemsTitle: 'Item & Poin Utama Dokumen',
    itemsFoundSuffix: 'Poin Ditemukan',
    btnKeyPoints: 'Poin Utama',
    btnBreakdown: 'Tabel Rincian',
    searchPlaceholder: 'Cari item...',
    exportCsv: 'CSV',
    thNo: 'No',
    thDesc: 'Deskripsi Produk / Layanan',
    thQty: 'Jumlah (Qty)',
    thUnitPrice: 'Harga Satuan',
    thTotal: 'Total Harga',
    noItemsFound: 'Tidak ada item yang cocok dengan pencarian',

    // JSON Viewer
    jsonTitle: 'Output Terstruktur JSON (Strict Valid JSON)',
    jsonVerified: 'Skema Terverifikasi',
    btnStrict: 'Strict (6 Kunci)',
    btnExtended: 'Extended Penuh',
    btnCopyJson: 'Salin JSON',
    btnDownloadJson: 'Unduh .json',
    jsonMandatoryNote: '✓ 6 Kunci Utama Wajib:',
    payloadSizeLabel: 'Ukuran payload:',

    // Chat
    chatTitle: 'Tanya Dokumen (AI Financial Assistant)',
    interactiveBadge: 'Interaktif',
    chatContextLabel: 'Konteks:',
    chatPlaceholder: 'Tanyakan detail pajak, nomor rekening, tanggal, atau isi dokumen...',
    sendBtn: 'Kirim',
    analyzingQuestion: 'Menganalisis pertanyaan terhadap isi dokumen...',

    // Printable Report
    printBarTitle: 'Format Laporan Eksekutif Resmi Siap Cetak / Arsip',
    printBtn: 'Cetak / Unduh PDF',
    auditReportHeader: 'LAPORAN AUDIT & EKSTRAKSI FINANSIAL AI',
    verificationSheet: 'LEMBAR VERIFIKASI DOKUMEN',
    auditCode: 'Kode Audit:',
    analysisTime: 'Waktu Analisis:',
    taxAndFinancialDetails: 'Rincian Pajak & Skema Finansial',
    verifiedAiSignature: 'Diverifikasi oleh DocuFinance AI • Model: Gemini 3.8 Flash',
    pageOf: 'Halaman 1 dari 1',

    // History Modal
    historyTitle: 'Riwayat Pemindaian Dokumen',
    historySubtitle: 'Daftar dokumen yang telah dianalisis pada sesi peramban ini',
    clearHistoryBtn: 'Bersihkan',
    noHistoryTitle: 'Belum ada riwayat dokumen tersimpan.',
    noHistoryDesc: 'Unggah atau pilih sampel dokumen untuk memulai analisis.',
    openDoc: 'Buka',

    // Format Help
    guideTitle: 'Spesifikasi Format & Pedoman Sistem',
    guideSubtitle: 'Pedoman ekstraksi informasi dokumen finansial berbasis AI',
    mandateTitle: 'Mandat Analisis Dokumen',
    mandateList: [
      'Mengekstrak informasi kunci secara akurat dari dokumen atau foto yang diunggah.',
      'Menyediakan ringkasan eksekutif yang padat, jelas, dan informatif.',
      'Menghasilkan data terstruktur strictly dalam format JSON valid dengan 6 kunci utama.',
    ],
    sixKeysTitle: '6 Kunci JSON Wajib:',
    understandCloseBtn: 'Mengerti & Tutup',

    // Footer
    footerSystem: 'DocuFinance AI • Sistem Analisis Finansial & Dokumen Bisnis',
  },
  en: {
    appTitle: 'DocuFinance AI',
    appSubtitle: 'AI Document Analyzer & Financial Assistant',
    onlineBadge: 'Gemini 3.8 Flash Online',
    historyBtn: 'History',
    formatGuideBtn: 'Format Guide',
    strictJsonBadge: 'Strict JSON Output',

    // Hero
    heroTag: 'AI Document & Financial Assistant',
    heroSubTag: 'Precision Extraction • Bilingual Summaries • Valid Strict JSON',
    heroTitle: 'Scan Receipts, Invoices, and Business Documents with AI',
    heroDesc: 'Read and extract document type, issuer (vendor/company), date, total amount, and key line items into strict JSON schema with executive summaries.',
    viewSchemaBtn: 'View Required JSON Schema',

    // Uploader
    uploaderTitle: 'Select or Upload Document',
    uploaderSubtitle: 'Supports Receipts, Invoices, Contracts, and Financial Reports',
    tabSamples: 'Ready Samples',
    tabUpload: 'Upload File',
    tabCamera: 'Camera',
    tabText: 'OCR Text',

    // Samples
    sampleHeader: '5 Real-World Document Samples (Click for instant analysis):',
    sampleBadge: '1-Click Ready',
    sampleAnalyzeBtn: 'Analyze Document',

    // Upload zone
    dropTitle: 'Drag & Drop Your Document Image Here',
    dropDesc: 'Supports receipt photos, digital invoices, bill screenshots, business contracts (PNG, JPG, WebP). You can also paste directly (Ctrl+V).',
    browseBtn: 'Choose File from Device',

    // Camera
    cameraAreaText: '[DOCUMENT AREA]',
    cameraFocusText: 'TEXT FOCUS',
    cameraHint: 'Align document inside the frame & ensure bright lighting',
    closeCameraBtn: 'Close Camera',
    captureBtn: 'Take Photo & Analyze',
    cameraError: 'Failed to access camera. Please grant camera permissions in your browser.',
    retryCameraBtn: 'Retry Camera Access',

    // Text OCR
    textLabel: 'Paste Document Content, Invoice Text, or Financial Report Transcript:',
    textPlaceholder: 'Example:\nTECH STORE SALES INVOICE\nDate: 05 October 2024\nInvoice No: INV-88219\nItem: LED Monitor 24 Inch x 2 @ $150.00 = $300.00\nSubtotal: $300.00\nTax 10%: $30.00\nTotal: $330.00',
    analyzeTextBtn: 'Analyze Document Text Now',

    // Status
    analyzingTitle: 'Gemini AI Is Analyzing Your Document...',
    analyzingDesc: 'Extracting document type, issuer name, date, financial totals, line items, and compiling executive summary.',
    analysisFailed: 'Failed to Process Document',
    closeBtn: 'Close',

    // Tabs
    tabDashboard: 'Executive Dashboard',
    tabSheets: 'Google Sheets & Analytics',
    tabDrive: 'Google Drive & Archive',
    tabStrictJson: 'Strict JSON (6 Keys)',
    tabChat: 'Ask Document',
    tabReport: 'Printable Report',

    // Workspace Actions
    syncToSheetsBtn: 'Sync to Google Sheets',
    saveToDriveBtn: 'Save to Google Drive',
    syncedToSheetsSuccess: 'Successfully added to Google Spreadsheet!',
    viewInSheets: 'Open in Google Sheets',

    // Summary Card
    execSummaryTitle: 'Executive Summary',
    playAudio: 'Play Audio',
    stopAudio: 'Stop',
    copy: 'Copy',
    copied: 'Copied!',
    confidenceLabel: 'AI Confidence Score',
    categoryLabel: 'Category',
    verifiedDoc: 'Verified Document',

    // Summary Language Switcher in Card
    summaryLangTitle: 'Summary Language:',
    summaryLangId: 'Indonesian',
    summaryLangEn: 'English',

    // Metrics
    metricDocType: '1. Document Type',
    metricVendor: '2. Vendor / Company',
    metricDate: '3. Date',
    metricAmount: '4. Total Amount',
    unknownType: 'Unidentified',
    verifiedClass: 'Document classification verified',
    officialIssuer: 'Official Issuer Entity',
    noDate: 'Not Available',
    dueDateLabel: 'Due date:',
    issueDateLabel: 'Document issue timestamp',
    nonFinancial: 'null (Non-Financial)',
    finalTotal: 'Final Bill Total',
    paymentMethodLabel: 'Method:',
    subtotalLabel: 'Subtotal:',
    taxLabel: 'Tax (VAT / Sales Tax):',
    discountLabel: 'Discount / Rebate:',
    paymentStatusLabel: 'Payment Status:',
    verifiedDetails: 'Verified Financial Details',

    // Items Table
    itemsTitle: 'Document Items & Main Points',
    itemsFoundSuffix: 'Points Extracted',
    btnKeyPoints: 'Key Points',
    btnBreakdown: 'Itemized Table',
    searchPlaceholder: 'Search items...',
    exportCsv: 'CSV',
    thNo: 'No',
    thDesc: 'Product / Service Description',
    thQty: 'Quantity (Qty)',
    thUnitPrice: 'Unit Price',
    thTotal: 'Total Price',
    noItemsFound: 'No items matching search query',

    // JSON Viewer
    jsonTitle: 'Structured JSON Output (Strict Valid JSON)',
    jsonVerified: 'Schema Verified',
    btnStrict: 'Strict (6 Keys)',
    btnExtended: 'Full Extended',
    btnCopyJson: 'Copy JSON',
    btnDownloadJson: 'Download .json',
    jsonMandatoryNote: '✓ 6 Mandatory Keys:',
    payloadSizeLabel: 'Payload size:',

    // Chat
    chatTitle: 'Ask Document (AI Financial Assistant)',
    interactiveBadge: 'Interactive',
    chatContextLabel: 'Context:',
    chatPlaceholder: 'Ask about tax breakdown, bank account, due date, reimbursement...',
    sendBtn: 'Send',
    analyzingQuestion: 'Analyzing question against document content...',

    // Printable Report
    printBarTitle: 'Official Executive Report Format Ready for Print / Archive',
    printBtn: 'Print / Download PDF',
    auditReportHeader: 'AI DOCUMENT AUDIT & FINANCIAL EXTRACTION REPORT',
    verificationSheet: 'DOCUMENT VERIFICATION DOSSIER',
    auditCode: 'Audit Code:',
    analysisTime: 'Analysis Date:',
    taxAndFinancialDetails: 'Tax Breakdown & Financial Scheme',
    verifiedAiSignature: 'Verified by DocuFinance AI • Model: Gemini 3.8 Flash',
    pageOf: 'Page 1 of 1',

    // History Modal
    historyTitle: 'Document Scan History',
    historySubtitle: 'List of documents analyzed during this browser session',
    clearHistoryBtn: 'Clear All',
    noHistoryTitle: 'No scan history recorded yet.',
    noHistoryDesc: 'Upload or pick a sample document to start analyzing.',
    openDoc: 'Open',

    // Format Help
    guideTitle: 'Format Specifications & Guidelines',
    guideSubtitle: 'AI-based financial document extraction guidelines',
    mandateTitle: 'Document Analysis Mandate',
    mandateList: [
      'Accurately extract key information from uploaded documents or images.',
      'Provide a clear, concise, and informative executive summary.',
      'Output extracted structured data strictly in valid JSON format with 6 required keys.',
    ],
    sixKeysTitle: '6 Required JSON Keys:',
    understandCloseBtn: 'Understood & Close',

    // Footer
    footerSystem: 'DocuFinance AI • Business Document & Financial Analysis System',
  },
};
