import { StrictDocumentData } from '../types/document';

export const INITIAL_SAMPLE_RESULT: StrictDocumentData = {
  document_type: 'Receipt',
  vendor_or_company: 'PT BUMI BERKAH BOGA (Kopi Kenangan Senopati)',
  date: '12 Oktober 2024',
  total_amount: 'Rp 110.880',
  key_items: [
    '2x Kopi Kenangan Mantan (L) - Rp 58.000',
    '1x Roti Coklat Klasik (Toasted) - Rp 16.000',
    '1x Avocado Coffee Float - Rp 28.000',
    '1x Mineral Water Pristine 600ml - Rp 10.000',
    'Diskon Member Gold (10%) - (-Rp 11.200)',
    'Pajak Restoran (PB1 10%) - Rp 10.080',
  ],
  summary: 'Struk transaksi pembayaran kafe Kopi Kenangan Senopati pada 12 Oktober 2024 dengan total pembayaran Rp 110.880 (setelah diskon member 10% dan pajak restoran PB1 10%). Pembayaran telah lunas melalui QRIS BCA Dinamis.',
  summary_en: 'Payment receipt from Kopi Kenangan Senopati on 12 October 2024 totaling Rp 110,880 including 10% restaurant tax and member discount. Paid in full via dynamic BCA QRIS.',
  extended_details: {
    currency: 'IDR',
    invoice_or_receipt_number: 'KK-202410-9821',
    subtotal: 'Rp 112.000',
    tax_or_ppn: 'Rp 10.080',
    discount: 'Rp 11.200',
    payment_method: 'QRIS BCA Dinamis (LUNAS)',
    confidence_score: 0.99,
    financial_category: 'Food & Beverage',
    itemized_breakdown: [
      { item_name: 'Kopi Kenangan Mantan (L)', quantity: 2, unit_price: 'Rp 29.000', total_price: 'Rp 58.000' },
      { item_name: 'Roti Coklat Klasik', quantity: 1, unit_price: 'Rp 16.000', total_price: 'Rp 16.000' },
      { item_name: 'Avocado Coffee Float', quantity: 1, unit_price: 'Rp 28.000', total_price: 'Rp 28.000' },
      { item_name: 'Mineral Water Pristine 600ml', quantity: 1, unit_price: 'Rp 10.000', total_price: 'Rp 10.000' },
    ],
  },
};
