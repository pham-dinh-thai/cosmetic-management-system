import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuditAction } from '../../../../domain/types';

export class RecordAuditLogRequest {
  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  actorName?: string;

  @IsEnum(AuditAction)
  action!: AuditAction;

  @IsString()
  @MaxLength(255)
  entityType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  entityId?: string;

  @IsOptional()
  @IsObject()
  before?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  after?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  userAgent?: string;
}
