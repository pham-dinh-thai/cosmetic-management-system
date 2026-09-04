import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class RecordPaymentRequest {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;
}

export class UpdateInvoiceRequest {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
