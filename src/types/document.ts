export interface StrictDocumentData {
  document_type: string;
  vendor_or_company: string;
  date: string | null;
  total_amount: string | null;
  key_items: string[];
  summary: string;
  summary_en?: string;
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

export interface SampleDocument {
  id: string;
  title: string;
  titleEn?: string;
  category: 'Receipt' | 'Invoice' | 'Contract' | 'Report';
  issuer: string;
  amount: string;
  description: string;
  descriptionEn?: string;
  imageThumbnail: string; // SVG data URI or image
  rawText: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  documentTitle: string;
  imageUrl?: string;
  data: StrictDocumentData;
}
