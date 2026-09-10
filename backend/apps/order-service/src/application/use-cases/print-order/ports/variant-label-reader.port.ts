export interface IVariantLabelReaderPort {
  getVariantLabels(variantIds: string[]): Promise<Record<string, string>>;
}

export const VARIANT_LABEL_READER_PORT = 'IVariantLabelReaderPort';