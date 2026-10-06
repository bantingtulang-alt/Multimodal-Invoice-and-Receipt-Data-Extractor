import { SampleDocument } from '../types/document';

// Helpers to generate SVG data URIs for realistic document previews
function createReceiptSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720" viewBox="0 0 480 720" style="background:#fff;font-family:'Courier New', monospace;color:#1e293b;">
    <rect width="480" height="720" fill="#fafafa"/>
    <rect x="20" y="20" width="440" height="680" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="8"/>
    
    <!-- Header -->
    <text x="240" y="60" text-anchor="middle" font-size="20" font-weight="bold" fill="#0f172a">KOPI KENANGAN SENOPATI</text>
    <text x="240" y="82" text-anchor="middle" font-size="12" fill="#64748b">PT BUMI BERKAH BOGA</text>
    <text x="240" y="100" text-anchor="middle" font-size="11" fill="#64748b">Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan</text>
    <text x="240" y="118" text-anchor="middle" font-size="11" fill="#64748b">NPWP: 01.345.678.9-012.000 | Tel: (021) 7280-999</text>
    
    <!-- Divider -->
    <line x1="40" y1="135" x2="440" y2="135" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1.5"/>
    
    <!-- Meta -->
    <text x="40" y="160" font-size="11" fill="#475569">No. Struk: KK-202410-9821</text>
    <text x="300" y="160" font-size="11" fill="#475569">Kasir: Siti Aisyah</text>
    <text x="40" y="180" font-size="11" fill="#475569">Tanggal : 12 Oktober 2024</text>
    <text x="300" y="180" font-size="11" fill="#475569">Waktu : 14:35:12 WIB</text>
    <text x="40" y="200" font-size="11" fill="#475569">Tipe    : DINE IN / Table 06</text>
    
    <line x1="40" y1="215" x2="440" y2="215" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1.5"/>
    
    <!-- Table Header -->
    <text x="40" y="235" font-size="12" font-weight="bold" fill="#1e293b">ITEM PESANAN</text>
    <text x="270" y="235" font-size="12" font-weight="bold" fill="#1e293b">QTY</text>
    <text x="430" y="235" text-anchor="end" font-size="12" font-weight="bold" fill="#1e293b">TOTAL</text>
    <line x1="40" y1="245" x2="440" y2="245" stroke="#94a3b8" stroke-width="1"/>
    
    <!-- Items -->
    <text x="40" y="270" font-size="12" font-weight="600" fill="#0f172a">Kopi Kenangan Mantan (L)</text>
    <text x="40" y="286" font-size="10" fill="#64748b">Less Sugar, Oat Milk (+5k)</text>
    <text x="275" y="270" font-size="12" fill="#334155">2</text>
    <text x="430" y="270" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">Rp 58.000</text>
    
    <text x="40" y="315" font-size="12" font-weight="600" fill="#0f172a">Roti Coklat Klasik</text>
    <text x="40" y="331" font-size="10" fill="#64748b">Toasted warm</text>
    <text x="275" y="315" font-size="12" fill="#334155">1</text>
    <text x="430" y="315" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">Rp 16.000</text>
    
    <text x="40" y="360" font-size="12" font-weight="600" fill="#0f172a">Avocado Coffee Float</text>
    <text x="40" y="376" font-size="10" fill="#64748b">Regular ice, espresso shot</text>
    <text x="275" y="360" font-size="12" fill="#334155">1</text>
    <text x="430" y="360" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">Rp 28.000</text>
    
    <text x="40" y="405" font-size="12" font-weight="600" fill="#0f172a">Mineral Water Pristine</text>
    <text x="40" y="421" font-size="10" fill="#64748b">600ml Cold</text>
    <text x="275" y="405" font-size="12" fill="#334155">1</text>
    <text x="430" y="405" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">Rp 10.000</text>
    
    <line x1="40" y1="440" x2="440" y2="440" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1.5"/>
    
    <!-- Calculations -->
    <text x="40" y="465" font-size="12" fill="#475569">Subtotal Pesanan</text>
    <text x="430" y="465" text-anchor="end" font-size="12" fill="#475569">Rp 112.000</text>
    
    <text x="40" y="488" font-size="12" fill="#16a34a">Diskon Member Gold (10%)</text>
    <text x="430" y="488" text-anchor="end" font-size="12" fill="#16a34a">- Rp 11.200</text>
    
    <text x="40" y="511" font-size="12" fill="#475569">Pajak Restoran (PB1 10%)</text>
    <text x="430" y="511" text-anchor="end" font-size="12" fill="#475569">Rp 10.080</text>
    
    <line x1="40" y1="525" x2="440" y2="525" stroke="#0f172a" stroke-width="2"/>
    
    <!-- Grand Total -->
    <text x="40" y="555" font-size="16" font-weight="bold" fill="#0f172a">TOTAL PEMBAYARAN</text>
    <text x="430" y="555" text-anchor="end" font-size="18" font-weight="bold" fill="#059669">Rp 110.880</text>
    
    <!-- Payment Method -->
    <text x="40" y="585" font-size="11" fill="#475569">Metode: QRIS BCA Dinamis (LUNAS)</text>
    <text x="40" y="602" font-size="11" fill="#475569">Ref No: RRN-992182049102</text>
    
    <line x1="40" y1="620" x2="440" y2="620" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1.5"/>
    
    <!-- Footer -->
    <text x="240" y="645" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">TERIMA KASIH ATAS KUNJUNGAN ANDA</text>
    <text x="240" y="665" text-anchor="middle" font-size="10" fill="#94a3b8">Simpan struk ini sebagai bukti transaksi resmi</text>
    <text x="240" y="682" text-anchor="middle" font-size="9" fill="#94a3b8">Customer Service WhatsApp: 0811-9988-7766</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createInvoiceSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780" style="background:#ffffff;font-family:'Segoe UI', Arial, sans-serif;">
    <rect width="600" height="780" fill="#ffffff"/>
    
    <!-- Top Accent Bar -->
    <rect x="0" y="0" width="600" height="10" fill="#2563eb"/>
    
    <!-- Header Block -->
    <text x="40" y="50" font-size="22" font-weight="800" fill="#1e293b">PT SOLUSI CLOUD INDONESIA</text>
    <text x="40" y="70" font-size="11" fill="#64748b">Gedung Cyber 2 Tower Lantai 18, Jl. H.R. Rasuna Said, Kuningan, Jakarta Selatan</text>
    <text x="40" y="86" font-size="11" fill="#64748b">Email: billing@cloudsolusi.co.id | NPWP: 02.876.543.1-014.000</text>
    
    <!-- Invoice Title Badge -->
    <rect x="420" y="32" width="140" height="38" rx="6" fill="#eff6ff"/>
    <text x="490" y="56" text-anchor="middle" font-size="18" font-weight="bold" fill="#1d4ed8">INVOICE</text>
    
    <!-- Metadata Grid -->
    <rect x="40" y="115" width="520" height="90" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="60" y="142" font-size="11" font-weight="bold" fill="#64748b">NO. INVOICE</text>
    <text x="60" y="162" font-size="13" font-weight="bold" fill="#0f172a">INV/2024/09/8821</text>
    <text x="60" y="186" font-size="11" fill="#64748b">PO Ref: PO-MS-9941</text>
    
    <text x="240" y="142" font-size="11" font-weight="bold" fill="#64748b">TANGGAL PENERBITAN</text>
    <text x="240" y="162" font-size="13" font-weight="bold" fill="#0f172a">28 September 2024</text>
    
    <text x="400" y="142" font-size="11" font-weight="bold" fill="#dc2626">JATUH TEMPO</text>
    <text x="400" y="162" font-size="13" font-weight="bold" fill="#dc2626">15 Oktober 2024</text>
    <text x="400" y="186" font-size="11" fill="#16a34a">Status: BELUM LUNAS</text>
    
    <!-- Bill To -->
    <text x="40" y="235" font-size="12" font-weight="bold" fill="#475569">DITUJUKAN KEPADA (BILL TO):</text>
    <text x="40" y="255" font-size="15" font-weight="bold" fill="#0f172a">PT Makmur Sentosa Abadi</text>
    <text x="40" y="273" font-size="11" fill="#475569">Attn: Bagian Keuangan / Bapak Hendra Gunawan</text>
    <text x="40" y="290" font-size="11" fill="#475569">Wisma Mulia Lt. 12, Jl. Gatot Subroto No. 40, Jakarta 12710</text>
    <text x="40" y="307" font-size="11" fill="#475569">NPWP: 01.999.888.7-011.000</text>
    
    <!-- Items Table Header -->
    <rect x="40" y="330" width="520" height="32" fill="#1e293b" rx="4"/>
    <text x="55" y="351" font-size="11" font-weight="bold" fill="#f8fafc">DESKRIPSI LAYANAN</text>
    <text x="320" y="351" font-size="11" font-weight="bold" fill="#f8fafc">PERIODE / QTY</text>
    <text x="420" y="351" font-size="11" font-weight="bold" fill="#f8fafc">HARGA SATUAN</text>
    <text x="545" y="351" text-anchor="end" font-size="11" font-weight="bold" fill="#f8fafc">TOTAL (IDR)</text>
    
    <!-- Row 1 -->
    <text x="55" y="385" font-size="12" font-weight="600" fill="#0f172a">Cloud Compute Enterprise Cluster</text>
    <text x="55" y="401" font-size="10" fill="#64748b">16 vCPU, 64GB RAM, NVMe High IOPS Storage</text>
    <text x="320" y="385" font-size="11" fill="#334155">1 Bulan (Okt 2024)</text>
    <text x="420" y="385" font-size="11" fill="#334155">12.500.000</text>
    <text x="545" y="385" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">12.500.000</text>
    <line x1="40" y1="415" x2="560" y2="415" stroke="#f1f5f9"/>
    
    <!-- Row 2 -->
    <text x="55" y="438" font-size="12" font-weight="600" fill="#0f172a">Managed Database PostgreSQL HA Cluster</text>
    <text x="55" y="454" font-size="10" fill="#64748b">Multi-AZ Automatic Failover & Daily Snapshots</text>
    <text x="320" y="438" font-size="11" fill="#334155">1 Bulan (Okt 2024)</text>
    <text x="420" y="438" font-size="11" fill="#334155">4.200.000</text>
    <text x="545" y="438" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">4.200.000</text>
    <line x1="40" y1="468" x2="560" y2="468" stroke="#f1f5f9"/>
    
    <!-- Row 3 -->
    <text x="55" y="491" font-size="12" font-weight="600" fill="#0f172a">DDoS Protection & Enterprise CDN</text>
    <text x="55" y="507" font-size="10" fill="#64748b">Bandwidth 10TB Tier-1 Global Edge Routing</text>
    <text x="320" y="491" font-size="11" fill="#334155">1 Paket</text>
    <text x="420" y="491" font-size="11" fill="#334155">1.500.000</text>
    <text x="545" y="491" text-anchor="end" font-size="12" font-weight="600" fill="#0f172a">1.500.000</text>
    <line x1="40" y1="520" x2="560" y2="520" stroke="#cbd5e1"/>
    
    <!-- Financial Summary -->
    <text x="340" y="545" font-size="12" fill="#475569">Subtotal DPP:</text>
    <text x="545" y="545" text-anchor="end" font-size="12" font-weight="bold" fill="#0f172a">Rp 18.200.000</text>
    
    <text x="340" y="570" font-size="12" fill="#475569">PPN (11% UU HPP):</text>
    <text x="545" y="570" text-anchor="end" font-size="12" font-weight="bold" fill="#0f172a">Rp 2.002.000</text>
    
    <rect x="330" y="585" width="230" height="42" fill="#f0fdf4" rx="6" stroke="#bbf7d0"/>
    <text x="345" y="612" font-size="13" font-weight="bold" fill="#166534">TOTAL TAGIHAN:</text>
    <text x="545" y="612" text-anchor="end" font-size="15" font-weight="800" fill="#15803d">Rp 20.202.000</text>
    
    <!-- Bank Information -->
    <rect x="40" y="640" width="520" height="90" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="55" y="662" font-size="11" font-weight="bold" fill="#0f172a">INSTRUKSI PEMBAYARAN TRANSFER BANK:</text>
    <text x="55" y="682" font-size="11" fill="#334155">Bank Mandiri Cabang Sudirman | No. Rek: 122-00-9876543-2</text>
    <text x="55" y="700" font-size="11" fill="#334155">Bank Central Asia (BCA) | No. Rek: 541-098-7621</text>
    <text x="55" y="718" font-size="10" fill="#64748b">A.N. PT SOLUSI CLOUD INDONESIA | Cantumkan nomor invoice pada berita transfer</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createMarketplaceSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="550" height="740" viewBox="0 0 550 740" style="background:#ffffff;font-family:'Segoe UI', sans-serif;">
    <rect width="550" height="740" fill="#ffffff"/>
    <rect x="15" y="15" width="520" height="710" fill="#ffffff" stroke="#03ac0e" stroke-width="2" rx="10"/>
    
    <!-- Logo & Header -->
    <text x="45" y="55" font-size="20" font-weight="bold" fill="#03ac0e">TOKOPEDIA INVOICE</text>
    <text x="45" y="75" font-size="11" fill="#64748b">Bukti Pembayaran Pesanan Belanja Online</text>
    
    <text x="500" y="55" text-anchor="end" font-size="13" font-weight="bold" fill="#0f172a">INV/20241003/MPL/351290118</text>
    <text x="500" y="75" text-anchor="end" font-size="11" fill="#16a34a">STATUS: BERHASIL / LUNAS</text>
    
    <line x1="35" y1="95" x2="515" y2="95" stroke="#e2e8f0" stroke-width="1"/>
    
    <!-- Detail Transaksi -->
    <text x="45" y="125" font-size="11" font-weight="bold" fill="#64748b">PENJUAL (SELLER)</text>
    <text x="45" y="145" font-size="13" font-weight="bold" fill="#0f172a">PT Eka Sarana Digital (Official Store)</text>
    <text x="45" y="163" font-size="11" fill="#475569">Kota Jakarta Barat, DKI Jakarta</text>
    
    <text x="310" y="125" font-size="11" font-weight="bold" fill="#64748b">PEMBELI (BUYER)</text>
    <text x="310" y="145" font-size="13" font-weight="bold" fill="#0f172a">Bambang Trihatmojo</text>
    <text x="310" y="163" font-size="11" fill="#475569">Jl. Palem Hijau No. 18, Tangerang Selatan</text>
    
    <!-- Order Info -->
    <rect x="35" y="185" width="480" height="48" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="50" y="214" font-size="11" fill="#475569">Tanggal Pembelian: <tspan font-weight="bold" fill="#0f172a">03 Oktober 2024, 09:22 WIB</tspan></text>
    <text x="310" y="214" font-size="11" fill="#475569">Metode: <tspan font-weight="bold" fill="#0f172a">GoPay Saldo</tspan></text>
    
    <!-- Items Table -->
    <text x="45" y="265" font-size="13" font-weight="bold" fill="#0f172a">DAFTAR PRODUK</text>
    
    <rect x="35" y="280" width="480" height="85" rx="6" fill="#fdfdfd" stroke="#f1f5f9"/>
    <text x="50" y="306" font-size="12" font-weight="bold" fill="#0f172a">Monitor Gaming 27 Inch 4K UHD 144Hz IPS</text>
    <text x="50" y="325" font-size="10" fill="#64748b">Varian: Black Matte | Garansi Resmi 3 Tahun</text>
    <text x="50" y="345" font-size="11" fill="#475569">1 Barang x Rp 4.199.000</text>
    <text x="495" y="345" text-anchor="end" font-size="13" font-weight="bold" fill="#0f172a">Rp 4.199.000</text>
    
    <rect x="35" y="375" width="480" height="85" rx="6" fill="#fdfdfd" stroke="#f1f5f9"/>
    <text x="50" y="401" font-size="12" font-weight="bold" fill="#0f172a">Keyboard Mekanikal Wireless Tri-Mode RGB</text>
    <text x="50" y="420" font-size="10" fill="#64748b">Switch: Gateron Yellow Pre-lubed | Hot-swappable</text>
    <text x="50" y="440" font-size="11" fill="#475569">1 Barang x Rp 850.000</text>
    <text x="495" y="440" text-anchor="end" font-size="13" font-weight="bold" fill="#0f172a">Rp 850.000</text>
    
    <!-- Shipping & Fees -->
    <text x="45" y="490" font-size="12" font-weight="bold" fill="#0f172a">RINCIAN BIAYA</text>
    
    <text x="45" y="520" font-size="12" fill="#475569">Total Harga Barang (2 Barang):</text>
    <text x="495" y="520" text-anchor="end" font-size="12" fill="#0f172a">Rp 5.049.000</text>
    
    <text x="45" y="542" font-size="12" fill="#475569">Total Ongkos Kirim (JNE Cargo 8.5 kg):</text>
    <text x="495" y="542" text-anchor="end" font-size="12" fill="#0f172a">Rp 75.000</text>
    
    <text x="45" y="564" font-size="12" fill="#16a34a">Kupon Diskon Bebas Ongkir Extra:</text>
    <text x="495" y="564" text-anchor="end" font-size="12" fill="#16a34a">- Rp 30.000</text>
    
    <text x="45" y="586" font-size="12" fill="#475569">Asuransi Pengiriman Elektronik:</text>
    <text x="495" y="586" text-anchor="end" font-size="12" fill="#0f172a">Rp 10.000</text>
    
    <line x1="35" y1="605" x2="515" y2="605" stroke="#0f172a" stroke-width="1.5"/>
    
    <text x="45" y="635" font-size="14" font-weight="bold" fill="#0f172a">TOTAL BELANJA:</text>
    <text x="495" y="635" text-anchor="end" font-size="18" font-weight="bold" fill="#03ac0e">Rp 5.104.000</text>
    
    <!-- Verification Note -->
    <rect x="35" y="660" width="480" height="50" rx="6" fill="#f0fdf4"/>
    <text x="50" y="682" font-size="10" fill="#166534">Faktur ini merupakan bukti pembayaran resmi yang sah diterbitkan oleh sistem elektronik Tokopedia.</text>
    <text x="50" y="698" font-size="10" fill="#166534">Tanggal cetak sistem: 03 Oktober 2024 | ID Kurir: JNE-CG-88210394</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createContractSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780" style="background:#ffffff;font-family:'Times New Roman', serif;">
    <rect width="600" height="780" fill="#ffffff"/>
    <rect x="25" y="25" width="550" height="730" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
    
    <!-- Title -->
    <text x="300" y="65" text-anchor="middle" font-size="16" font-weight="bold" fill="#0f172a" font-family="'Times New Roman', serif">SURAT PERJANJIAN KERJASAMA</text>
    <text x="300" y="85" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">JASA PENGEMBANGAN SISTEM INFORMASI ENTERPRISE</text>
    <text x="300" y="105" text-anchor="middle" font-size="11" fill="#475569">Nomor: 042/SPK-IT/SCM-AKP/I/2024</text>
    
    <line x1="50" y1="120" x2="550" y2="120" stroke="#0f172a" stroke-width="1.5"/>
    
    <text x="50" y="145" font-size="12" fill="#1e293b">Pada hari ini, Senin tanggal 15 Januari 2024, telah disepakati perjanjian kerjasama antara:</text>
    
    <!-- Party 1 -->
    <text x="50" y="170" font-size="12" font-weight="bold" fill="#0f172a">1. PT SURYA CITRA MEDIA TBK</text>
    <text x="65" y="188" font-size="11" fill="#334155">Berdomisili di SCTV Tower Senayan City, Jakarta, diwakili oleh Ir. Budi Santoso (Direktur Utama),</text>
    <text x="65" y="204" font-size="11" fill="#334155">selanjutnya disebut sebagai PIHAK PERTAMA (KLIEN).</text>
    
    <!-- Party 2 -->
    <text x="50" y="232" font-size="12" font-weight="bold" fill="#0f172a">2. PT ADHI KARYA PRATAMA DIGITAL</text>
    <text x="65" y="250" font-size="11" fill="#334155">Berdomisili di Menara Astra Lantai 22, Jakarta Pusat, diwakili oleh Diana Kusuma, M.Kom,</text>
    <text x="65" y="266" font-size="11" fill="#334155">selanjutnya disebut sebagai PIHAK KEDUA (KONSULTAN / PENYEDIA JASA).</text>
    
    <line x1="50" y1="285" x2="550" y2="285" stroke="#cbd5e1" stroke-width="1"/>
    
    <!-- Articles -->
    <text x="300" y="310" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">PASAL 1: RUANG LINGKUP PEKERJAAN</text>
    <text x="50" y="330" font-size="11" fill="#334155">Pihak Kedua berkewajiban merancang, membangun, dan mengimplementasikan Sistem Enterprise</text>
    <text x="50" y="346" font-size="11" fill="#334155">Resource Planning (ERP) modul Keuangan, Pengadaan, dan Manajemen Inventaris Aset.</text>
    
    <text x="300" y="380" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">PASAL 2: NILAI KONTRAK DAN TATA CARA PEMBAYARAN</text>
    <text x="50" y="402" font-size="11" fill="#334155">Total Nilai Kontrak disepakati sebesar <tspan font-weight="bold">Rp 150.000.000,- (Seratus Lima Puluh Juta Rupiah)</tspan></text>
    <text x="50" y="418" font-size="11" fill="#334155">belum termasuk PPN 11%, dengan skema pembayaran bertahap (termin):</text>
    
    <text x="65" y="440" font-size="11" fill="#334155">• Termin I (Uang Muka 30%) : Rp 45.000.000 setelah penandatanganan kontrak.</text>
    <text x="65" y="458" font-size="11" fill="#334155">• Termin II (Progress 50%)  : Rp 75.000.000 setelah User Acceptance Test (UAT) modul inti.</text>
    <text x="65" y="476" font-size="11" fill="#334155">• Termin III (Pelunasan 20%) : Rp 30.000.000 setelah Go-Live dan masa garansi 3 bulan.</text>
    
    <text x="300" y="510" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">PASAL 3: JANGKA WAKTU &amp; KERAHASIAAN INFORMASI</text>
    <text x="50" y="530" font-size="11" fill="#334155">1. Perjanjian ini berlaku selama 12 (dua belas) bulan terhitung sejak 15 Januari 2024 s/d 14 Januari 2025.</text>
    <text x="50" y="546" font-size="11" fill="#334155">2. Kedua belah pihak terikat klausul Non-Disclosure Agreement (NDA) atas seluruh data finansial.</text>
    
    <!-- Signatures -->
    <text x="120" y="605" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">PIHAK PERTAMA</text>
    <text x="120" y="620" text-anchor="middle" font-size="10" fill="#64748b">PT SURYA CITRA MEDIA TBK</text>
    
    <text x="450" y="605" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">PIHAK KEDUA</text>
    <text x="450" y="620" text-anchor="middle" font-size="10" fill="#64748b">PT ADHI KARYA PRATAMA</text>
    
    <rect x="75" y="635" width="90" height="40" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="2 2"/>
    <text x="120" y="658" text-anchor="middle" font-size="9" fill="#94a3b8">Materai 10.000</text>
    
    <text x="120" y="700" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">( Ir. Budi Santoso )</text>
    <text x="450" y="700" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">( Diana Kusuma, M.Kom )</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createReportSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760" style="background:#ffffff;font-family:'Segoe UI', sans-serif;">
    <rect width="600" height="760" fill="#ffffff"/>
    <rect x="20" y="20" width="560" height="720" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    
    <!-- Banner -->
    <path d="M 20 28 Q 20 20 28 20 L 572 20 Q 580 20 580 28 L 580 85 L 20 85 Z" fill="#0f172a"/>
    <text x="40" y="55" font-size="18" font-weight="bold" fill="#38bdf8">PT GRAHA FINANSIAL KONSULTINDO</text>
    <text x="40" y="75" font-size="11" fill="#94a3b8">RINGKASAN EKSEKUTIF KINERJA KEUANGAN KUARTAL III (Q3 2024)</text>
    
    <!-- Meta -->
    <text x="40" y="115" font-size="11" fill="#64748b">Tanggal Rilis: <tspan font-weight="bold" fill="#0f172a">30 September 2024</tspan></text>
    <text x="260" y="115" font-size="11" fill="#64748b">Auditor: <tspan font-weight="bold" fill="#0f172a">Kantor Akuntan Publik Haryanto &amp; Rekan</tspan></text>
    <text x="470" y="115" font-size="11" fill="#16a34a">Status: DIAUDIT (WTP)</text>
    
    <!-- 3 Metric Boxes -->
    <rect x="40" y="135" width="160" height="70" rx="6" fill="#f0fdf4" stroke="#86efac"/>
    <text x="55" y="160" font-size="11" fill="#166534">Total Pendapatan Q3</text>
    <text x="55" y="188" font-size="16" font-weight="bold" fill="#15803d">Rp 842.000.000</text>
    
    <rect x="220" y="135" width="160" height="70" rx="6" fill="#fff7ed" stroke="#fdba74"/>
    <text x="235" y="160" font-size="11" fill="#9a3412">Beban Operasional</text>
    <text x="235" y="188" font-size="16" font-weight="bold" fill="#c2410c">Rp 590.000.000</text>
    
    <rect x="400" y="135" width="160" height="70" rx="6" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="415" y="160" font-size="11" fill="#1e40af">Laba Bersih Bersih</text>
    <text x="415" y="188" font-size="16" font-weight="bold" fill="#1d4ed8">Rp 252.000.000</text>
    
    <!-- Section Breakdowns -->
    <text x="40" y="235" font-size="13" font-weight="bold" fill="#0f172a">RINCIAN POS LAPORAN LABA RUGI (PROFIT &amp; LOSS)</text>
    <line x1="40" y1="245" x2="560" y2="245" stroke="#cbd5e1"/>
    
    <text x="40" y="275" font-size="12" font-weight="bold" fill="#0f172a">1. Pendapatan Operasional Bersih</text>
    <text x="560" y="275" text-anchor="end" font-size="12" font-weight="bold" fill="#0f172a">Rp 842.000.000</text>
    <text x="60" y="295" font-size="11" fill="#64748b">• Pendapatan Jasa Konsultasi Pajak Korporasi: Rp 512.000.000</text>
    <text x="60" y="312" font-size="11" fill="#64748b">• Retainer Fee Audit Keuangan Tahunan: Rp 330.000.000</text>
    
    <text x="40" y="345" font-size="12" font-weight="bold" fill="#0f172a">2. Beban Pokok Pendapatan (COGS)</text>
    <text x="560" y="345" text-anchor="end" font-size="12" font-weight="bold" fill="#dc2626">(Rp 380.000.000)</text>
    <text x="60" y="365" font-size="11" fill="#64748b">• Gaji Auditor Senior &amp; Konsultan Lapangan: Rp 295.000.000</text>
    <text x="60" y="382" font-size="11" fill="#64748b">• Lisensi Software Audit &amp; Analitik Data: Rp 85.000.000</text>
    
    <text x="40" y="415" font-size="12" font-weight="bold" fill="#0f172a">3. Laba Kotor (Gross Profit)</text>
    <text x="560" y="415" text-anchor="end" font-size="12" font-weight="bold" fill="#16a34a">Rp 462.000.000 (Margin 54.8%)</text>
    
    <text x="40" y="445" font-size="12" font-weight="bold" fill="#0f172a">4. Beban Operasional Umum &amp; Administrasi</text>
    <text x="560" y="445" text-anchor="end" font-size="12" font-weight="bold" fill="#dc2626">(Rp 210.000.000)</text>
    <text x="60" y="465" font-size="11" fill="#64748b">• Sewa Gedung Kantor &amp; Utilitas: Rp 120.000.000</text>
    <text x="60" y="482" font-size="11" fill="#64748b">• Biaya Marketing &amp; Business Development: Rp 90.000.000</text>
    
    <line x1="40" y1="510" x2="560" y2="510" stroke="#0f172a" stroke-width="2"/>
    
    <!-- Bottom Net Profit -->
    <rect x="40" y="525" width="520" height="50" rx="6" fill="#0f172a"/>
    <text x="60" y="555" font-size="14" font-weight="bold" fill="#f8fafc">LABA BERSIH SEBELUM PAJAK (EBIT):</text>
    <text x="540" y="555" text-anchor="end" font-size="18" font-weight="bold" fill="#38bdf8">Rp 252.000.000</text>
    
    <!-- Executive Takeaways -->
    <text x="40" y="605" font-size="12" font-weight="bold" fill="#0f172a">KESIMPULAN MANAJEMEN:</text>
    <text x="40" y="625" font-size="11" fill="#334155">• Pertumbuhan revenue kuartalan meningkat 18.4% YoY berkat ekspansi klien retainership korporasi.</text>
    <text x="40" y="643" font-size="11" fill="#334155">• Efisiensi biaya operasional berhasil mempertahankan marjin laba bersih pada level sehat 29.9%.</text>
    <text x="40" y="661" font-size="11" fill="#334155">• Rasio likuiditas kas lancar mencukupi untuk ekspansi cabang Surabaya pada Q4 2024.</text>
    
    <text x="300" y="710" text-anchor="middle" font-size="10" fill="#94a3b8">Dokumen rahasia internal perusahaan - Dilarang menggandakan tanpa izin tertulis</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'sample-receipt-kopi',
    title: 'Struk Resto Kopi Kenangan Senopati',
    titleEn: 'Senopati Cafe & Coffee Receipt',
    category: 'Receipt',
    issuer: 'PT BUMI BERKAH BOGA (Kopi Kenangan Senopati)',
    amount: 'Rp 110.880',
    description: 'Struk fisik kafe kuliner: pesanan minuman, diskon member, dan pajak restoran PB1 10%.',
    descriptionEn: 'Physical coffee shop receipt: beverage order, member discount, and 10% restaurant tax.',
    imageThumbnail: createReceiptSvg(),
    rawText: `KOPI KENANGAN SENOPATI
PT BUMI BERKAH BOGA
Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan
NPWP: 01.345.678.9-012.000
No. Struk: KK-202410-9821
Kasir: Siti Aisyah
Tanggal: 12 Oktober 2024
Waktu: 14:35:12 WIB
Tipe: DINE IN / Table 06

ITEM PESANAN:
- Kopi Kenangan Mantan (L) (Less Sugar, Oat Milk) x 2 = Rp 58.000
- Roti Coklat Klasik (Toasted) x 1 = Rp 16.000
- Avocado Coffee Float x 1 = Rp 28.000
- Mineral Water Pristine 600ml x 1 = Rp 10.000

Subtotal: Rp 112.000
Diskon Member Gold (10%): -Rp 11.200
Pajak Restoran (PB1 10%): Rp 10.080
TOTAL PEMBAYARAN: Rp 110.880
Metode: QRIS BCA Dinamis (LUNAS)
Ref No: RRN-992182049102`,
  },
  {
    id: 'sample-invoice-cloud',
    title: 'Invoice Tagihan Layanan Cloud B2B',
    titleEn: 'B2B Cloud Infrastructure Invoice',
    category: 'Invoice',
    issuer: 'PT SOLUSI CLOUD INDONESIA',
    amount: 'Rp 20.202.000',
    description: 'Invoice korporat infrastruktur server, database cluster PostgreSQL, PPN 11%, dan jatuh tempo.',
    descriptionEn: 'Enterprise cloud invoice: compute cluster, managed PostgreSQL, 11% VAT, and payment terms.',
    imageThumbnail: createInvoiceSvg(),
    rawText: `INVOICE
PT SOLUSI CLOUD INDONESIA
Gedung Cyber 2 Tower Lantai 18, Jl. H.R. Rasuna Said, Jakarta Selatan
NPWP: 02.876.543.1-014.000
NO. INVOICE: INV/2024/09/8821
PO Ref: PO-MS-9941
TANGGAL PENERBITAN: 28 September 2024
JATUH TEMPO: 15 Oktober 2024

DITUJUKAN KEPADA:
PT Makmur Sentosa Abadi
Attn: Bagian Keuangan / Hendra Gunawan
Wisma Mulia Lt. 12, Jl. Gatot Subroto No. 40, Jakarta

RINCIAN LAYANAN:
1. Cloud Compute Enterprise Cluster (16 vCPU, 64GB RAM) 1 Bulan = Rp 12.500.000
2. Managed Database PostgreSQL HA Cluster 1 Bulan = Rp 4.200.000
3. DDoS Protection & Enterprise CDN (Bandwidth 10TB) = Rp 1.500.000

Subtotal DPP: Rp 18.200.000
PPN (11%): Rp 2.002.000
TOTAL TAGIHAN: Rp 20.202.000
Status: BELUM LUNAS
Transfer ke Bank Mandiri 122-00-9876543-2 A.N. PT SOLUSI CLOUD INDONESIA`,
  },
  {
    id: 'sample-faktur-marketplace',
    title: 'Faktur Tokopedia Pembelian Gadget',
    titleEn: 'E-Commerce Marketplace Invoice',
    category: 'Invoice',
    issuer: 'PT Eka Sarana Digital (Official Store via Tokopedia)',
    amount: 'Rp 5.104.000',
    description: 'Bukti pembayaran transaksi e-commerce monitor 4K, keyboard mekanikal, ongkir dan asuransi.',
    descriptionEn: 'Online purchase receipt: 4K UHD monitor, mechanical keyboard, shipping, and cargo insurance.',
    imageThumbnail: createMarketplaceSvg(),
    rawText: `TOKOPEDIA INVOICE
INV/20241003/MPL/351290118
Tanggal Pembelian: 03 Oktober 2024, 09:22 WIB
Status: BERHASIL / LUNAS

Penjual: PT Eka Sarana Digital (Official Store)
Pembeli: Bambang Trihatmojo
Alamat: Jl. Palem Hijau No. 18, Tangerang Selatan
Metode Pembayaran: GoPay Saldo

PRODUK:
1. Monitor Gaming 27 Inch 4K UHD 144Hz IPS - Rp 4.199.000 (1 Unit)
2. Keyboard Mekanikal Wireless Tri-Mode RGB - Rp 850.000 (1 Unit)

Rincian:
Total Harga Barang (2 Barang): Rp 5.049.000
Ongkos Kirim (JNE Cargo 8.5 kg): Rp 75.000
Diskon Bebas Ongkir: -Rp 30.000
Asuransi Pengiriman Elektronik: Rp 10.000
TOTAL BELANJA: Rp 5.104.000`,
  },
  {
    id: 'sample-contract-spk',
    title: 'Kontrak Kerjasama IT Enterprise',
    titleEn: 'Enterprise IT Consulting Contract',
    category: 'Contract',
    issuer: 'PT SURYA CITRA MEDIA TBK & PT ADHI KARYA PRATAMA',
    amount: 'Rp 150.000.000',
    description: 'Surat Perjanjian Kerjasama (SPK) IT Konsultasi, 3 termin pembayaran, kerahasiaan NDA, masa 12 bulan.',
    descriptionEn: 'Master service agreement (MSA): 3 milestone payments, NDA confidentiality, 12-month term.',
    imageThumbnail: createContractSvg(),
    rawText: `SURAT PERJANJIAN KERJASAMA
JASA PENGEMBANGAN SISTEM INFORMASI ENTERPRISE
Nomor: 042/SPK-IT/SCM-AKP/I/2024
Tanggal: 15 Januari 2024

PIHAK PERTAMA: PT SURYA CITRA MEDIA TBK (Klien)
PIHAK KEDUA: PT ADHI KARYA PRATAMA DIGITAL (Konsultan IT)

Pasal 1: Ruang Lingkup Pekerjaan
Pihak Kedua merancang dan membangun ERP modul Keuangan, Pengadaan, dan Manajemen Inventaris Aset.

Pasal 2: Nilai Kontrak dan Termin Pembayaran
Total Nilai Kontrak: Rp 150.000.000 (Seratus Lima Puluh Juta Rupiah) belum termasuk PPN 11%.
- Termin I (Uang Muka 30%): Rp 45.000.000
- Termin II (UAT 50%): Rp 75.000.000
- Termin III (Go-Live & Garansi 20%): Rp 30.000.000

Pasal 3: Jangka Waktu & NDA
Berlaku 12 bulan (15 Januari 2024 s/d 14 Januari 2025). Terikat klausul Non-Disclosure Agreement.`,
  },
  {
    id: 'sample-report-keuangan',
    title: 'Laporan Laba Rugi Eksekutif Q3',
    titleEn: 'Q3 Executive Profit & Loss Report',
    category: 'Report',
    issuer: 'PT GRAHA FINANSIAL KONSULTINDO',
    amount: 'Rp 252.000.000',
    description: 'Laporan keuangan audit kuartalan: pendapatan Rp 842jt, beban COGS Rp 380jt, laba bersih Rp 252jt.',
    descriptionEn: 'Quarterly audited financials: Revenue Rp 842M, COGS Rp 380M, net operating profit Rp 252M.',
    imageThumbnail: createReportSvg(),
    rawText: `PT GRAHA FINANSIAL KONSULTINDO
RINGKASAN EKSEKUTIF KINERJA KEUANGAN KUARTAL III (Q3 2024)
Tanggal Rilis: 30 September 2024
Auditor: Kantor Akuntan Publik Haryanto & Rekan
Status: DIAUDIT (Wajar Tanpa Pengecualian)

1. Total Pendapatan Operasional: Rp 842.000.000
   - Jasa Konsultasi Pajak Korporasi: Rp 512.000.000
   - Retainer Fee Audit Keuangan Tahunan: Rp 330.000.000
2. Beban Pokok Pendapatan (COGS): (Rp 380.000.000)
3. Laba Kotor (Gross Profit): Rp 462.000.000 (Gross Margin: 54.8%)
4. Beban Operasional Umum & Admin: (Rp 210.000.000)
5. Laba Bersih Sebelum Pajak (EBIT): Rp 252.000.000 (Net Margin: 29.9%)

Kesimpulan:
Pertumbuhan revenue kuartalan naik 18.4% YoY. Marjin laba bersih terjaga sehat di 29.9%.`,
  },
];
