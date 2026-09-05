export interface ICreateOrderPortLine {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface ICreateOrderPort {
  execute(request: {
    customerId: string;
    lines: ICreateOrderPortLine[];
  }): Promise<{ id: string }>;
}

export const CREATE_ORDER_PORT = 'ICreateOrderPort';
