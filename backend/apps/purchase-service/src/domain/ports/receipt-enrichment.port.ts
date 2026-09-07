export interface ReceiptSupplierInfo {
  name: string;
  address: string | null;
}

export interface IReceiptEnrichmentPort {
  getSupplierInfo(id: string): Promise<ReceiptSupplierInfo | null>;
  getVariantNames(ids: string[]): Promise<Map<string, string>>;
}

export const RECEIPT_ENRICHMENT_PORT = 'IReceiptEnrichmentPort';