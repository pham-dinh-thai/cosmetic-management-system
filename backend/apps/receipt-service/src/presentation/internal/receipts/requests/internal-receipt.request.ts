import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiptFromInvoicePaymentRequest {
  @IsString()
  invoiceId!: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;
}