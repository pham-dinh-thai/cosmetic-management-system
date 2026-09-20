import { ordersService, type BestSellerItem } from "./orders.service";
import {
  productsService,
  type CosmeticDetail,
  type CosmeticSummary,
} from "./products.service";

export interface ShopProduct {
  code: string;
  name: string;
  price: string;
  accent: string;
  imageUrl?: string | null;
}

const ACCENTS = ["#1c3a13", "#9f995b", "#757c5d", "#698e79"];

const formatPrice = (value: number): string =>
  `${value.toLocaleString("vi-VN")}₫`;

export async function fetchShopProducts(
  fallback: ShopProduct[],
  max = 4,
): Promise<ShopProduct[]> {
  const [bestSellers, summaries] = await Promise.all([
    ordersService.getBestSellers(24).catch((): BestSellerItem[] => []),
    productsService.getCosmetics().catch((): CosmeticSummary[] => []),
  ]);

  const activeCosmetics = summaries.filter((c) => c.isActive);

  const details = await Promise.all(
    activeCosmetics.map((cosmetic) =>
      productsService
        .getCosmeticById(cosmetic.id)
        .catch((): CosmeticDetail | null => null),
    ),
  );

  const variantToCosmeticId = new Map<string, string>();
  for (const detail of details) {
    if (!detail) {
      continue;
    }
    for (const variant of detail.variants) {
      variantToCosmeticId.set(variant.id, detail.id);
    }
  }

  const soldByCosmeticId = new Map<string, number>();
  for (const item of bestSellers) {
    const cosmeticId = variantToCosmeticId.get(item.variantId);
    if (!cosmeticId) {
      continue;
    }
    soldByCosmeticId.set(
      cosmeticId,
      (soldByCosmeticId.get(cosmeticId) ?? 0) + item.quantitySold,
    );
  }

  const picked: ShopProduct[] = [];
  const usedCategories = new Set<string>();

  const rankedIds = [...soldByCosmeticId.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  for (const cosmeticId of rankedIds) {
    if (picked.length >= max) {
      break;
    }
    const detail = details.find((d) => d?.id === cosmeticId);
    if (!detail) {
      continue;
    }

    const categoryKey = detail.categoryIds[0] ?? `uncategorized:${detail.id}`;
    if (usedCategories.has(categoryKey)) {
      continue;
    }
    usedCategories.add(categoryKey);

    const activeVariants = detail.variants.filter((v) => v.isActive);
    const price = activeVariants.length
      ? Math.min(...activeVariants.map((v) => v.price))
      : 0;

    picked.push({
      code: detail.code,
      name: detail.name,
      price: price > 0 ? formatPrice(price) : "Liên hệ",
      accent: ACCENTS[picked.length % ACCENTS.length],
      imageUrl: detail.imageUrl,
    });
  }

  const addedCodes = new Set(picked.map((p) => p.code));
  for (const product of fallback) {
    if (picked.length >= max) {
      break;
    }
    if (addedCodes.has(product.code)) {
      continue;
    }
    picked.push(product);
    addedCodes.add(product.code);
  }

  return picked;
}