import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IReceiptEnrichmentPort,
  ReceiptSupplierInfo,
} from '../../domain/ports/receipt-enrichment.port';

@Injectable()
export class ReceiptEnrichmentAdapter implements IReceiptEnrichmentPort {
  private readonly supplierServiceUrl: string;
  private readonly cosmeticServiceUrl: string;
  private readonly userServiceUrl: string;

  public constructor(config: ConfigService) {
    this.supplierServiceUrl = config.getOrThrow<string>('SUPPLIER_SERVICE_URL');
    this.cosmeticServiceUrl = config.getOrThrow<string>('COSMETIC_SERVICE_URL');
    this.userServiceUrl = config.getOrThrow<string>('USER_SERVICE_URL');
  }

  public async getUserName(id: string): Promise<string | null> {
    if (!id) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.userServiceUrl}/api/internal/users/by-id/${id}`,
      );

      if (!response.ok) {
        return null;
      }

      const body = (await response.json()) as {
        firstName?: string;
        lastName?: string;
      };

      return [body.firstName, body.lastName].filter(Boolean).join(' ') || null;
    } catch {
      return null;
    }
  }

  public async getSupplierInfo(id: string): Promise<ReceiptSupplierInfo | null> {
    try {
      const response = await fetch(
        `${this.supplierServiceUrl}/api/internal/suppliers/${id}`,
      );

      if (!response.ok) {
        return null;
      }

      const body = (await response.json()) as {
        name?: string;
        address?: string | null;
      };

      return { name: body.name ?? id, address: body.address ?? null };
    } catch {
      return null;
    }
  }

  public async getVariantNames(ids: string[]): Promise<Map<string, string>> {
    try {
      const uniqueIds = [...new Set(ids)];
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await fetch(
              `${this.cosmeticServiceUrl}/api/internal/cosmetics/variants/${id}`,
            );

            if (!response.ok) {
              return null;
            }

            const body = (await response.json()) as {
              id?: string;
              name?: string;
            };

            return body;
          } catch {
            return null;
          }
        }),
      );

      const names = new Map<string, string>();
      for (const result of results) {
        if (result?.id && result.name) {
          names.set(result.id, result.name);
        }
      }

      return names;
    } catch {
      return new Map<string, string>();
    }
  }
}