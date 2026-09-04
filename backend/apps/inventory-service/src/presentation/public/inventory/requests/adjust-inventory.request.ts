import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AdjustInventoryRequest {
  @ApiProperty({
    description: 'Signed delta to add to current stock (negative to decrease)',
  })
  @IsInt()
  adjustment!: number;
}
