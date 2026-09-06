export interface IVariantsReaderPort {
  findVariantUnitPrice(variantId: string): Promise<number>;
}

export const VARIANT_READER_PORT = 'IVariantsReaderPort';
