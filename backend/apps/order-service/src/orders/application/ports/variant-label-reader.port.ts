export type VariantLabelData = {
  cosmeticName: string;
  variantName: string | null;
};

export interface IVariantLabelReaderPort {
  getVariantLabels(variantIds: string[]): Promise<Record<string, string>>;
  getVariantData(
    variantIds: string[],
  ): Promise<Record<string, VariantLabelData>>;
}

export const VARIANT_LABEL_READER_PORT = 'IVariantLabelReaderPort';
