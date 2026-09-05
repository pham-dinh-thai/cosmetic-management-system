export interface VariantReadModel {
  id: string;
  name: string;
  price: number;
}

export interface IVariantReaderPort {
  findById(id: string): Promise<VariantReadModel | null>;
}

export const VARIANT_READER_PORT = 'IVariantReaderPort';
