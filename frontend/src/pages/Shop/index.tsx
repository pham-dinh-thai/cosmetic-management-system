import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/Header";
import {
  productsService,
  type CategorySummary,
  type CosmeticSummary,
} from "../../services/products.service";
import { useCartStore } from "../../store/useCartStore";

export interface DisplayProduct {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  categoryIds: string[];
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  accent: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const SEED_ACCENTS = ["#1c3a13", "#757c5d", "#9f995b", "#698e79", "#4a533c", "#5c6b54"];

const accentFor = (code: string): string => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash + code.charCodeAt(i)) % SEED_ACCENTS.length;
  }
  return SEED_ACCENTS[hash];
};

const formatPriceVND = (value: number): string =>
  `${value.toLocaleString("vi-VN")}₫`;

type PriceRangeKey = "all" | "under-300" | "300-600" | "600-1000" | "over-1000" | "custom";
type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "stock-desc";

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);

  // Data states
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeKey>("all");
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load products & categories
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [apiCosmetics, apiCategories] = await Promise.all([
          productsService.getCosmetics().catch(() => [] as CosmeticSummary[]),
          productsService.getCategories().catch(() => [] as CategorySummary[]),
        ]);

        // Load details for all active cosmetics
        const activeSummaries = apiCosmetics.filter((c) => c.isActive);
        const details = await Promise.all(
          activeSummaries.map((c) =>
            productsService.getCosmeticById(c.id).catch(() => null),
          ),
        );

        const loadedProducts: DisplayProduct[] = [];
        for (const detail of details) {
          if (!detail || !detail.isActive) continue;

          const activeVariants = detail.variants.filter((v) => v.isActive);
          const prices = activeVariants.map((v) => v.price).filter((p) => p > 0);
          const minP = prices.length > 0 ? Math.min(...prices) : 0;
          const maxP = prices.length > 0 ? Math.max(...prices) : minP;
          const stockSum = activeVariants.reduce((sum, v) => sum + (v.quantity || 0), 0);

          loadedProducts.push({
            id: detail.id,
            code: detail.code,
            name: detail.name,
            brand: detail.brand,
            origin: detail.origin,
            description: detail.description,
            imageUrl: detail.imageUrl,
            categoryIds: detail.categoryIds || [],
            minPrice: minP,
            maxPrice: maxP,
            totalStock: stockSum,
            accent: accentFor(detail.code),
            isNew: true,
            variants: activeVariants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              quantity: v.quantity,
            })),
          });
        }

        if (active) {
          setProducts(loadedProducts);
          setCategories(apiCategories.filter((c) => c.isActive));
        }
      } catch (err) {
        console.error("Failed to load products for shop:", err);
        if (active) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  // Update query params when category changes
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryId);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Distinct Brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    for (const p of products) {
      if (p.brand && p.brand.trim()) {
        brands.add(p.brand.trim());
      }
    }
    return Array.from(brands).sort();
  }, [products]);

  // Product Counts per category
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("all", products.length);
    for (const p of products) {
      for (const cid of p.categoryIds) {
        map.set(cid, (map.get(cid) || 0) + 1);
      }
    }
    return map;
  }, [products]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Keyword search
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCode = product.code.toLowerCase().includes(q);
          const matchBrand = product.brand?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchBrand && !matchDesc) {
            return false;
          }
        }

        // Category filter
        if (selectedCategoryId !== "all") {
          if (!product.categoryIds.includes(selectedCategoryId)) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== "all") {
          if (product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
            return false;
          }
        }

        // In-stock only
        if (inStockOnly) {
          if (product.totalStock <= 0) {
            return false;
          }
        }

        // Price range filter
        const price = product.minPrice;
        if (selectedPriceRange === "under-300") {
          if (price >= 300000) return false;
        } else if (selectedPriceRange === "300-600") {
          if (price < 300000 || price > 600000) return false;
        } else if (selectedPriceRange === "600-1000") {
          if (price < 600000 || price > 1000000) return false;
        } else if (selectedPriceRange === "over-1000") {
          if (price <= 1000000) return false;
        } else if (selectedPriceRange === "custom") {
          const min = customMinPrice ? Number(customMinPrice) : 0;
          const max = customMaxPrice ? Number(customMaxPrice) : Infinity;
          if (price < min || price > max) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return a.minPrice - b.minPrice;
        }
        if (sortBy === "price-desc") {
          return b.minPrice - a.minPrice;
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name, "vi");
        }
        if (sortBy === "stock-desc") {
          return b.totalStock - a.totalStock;
        }
        // Default newest
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedCategoryId,
    selectedBrand,
    inStockOnly,
    selectedPriceRange,
    customMinPrice,
    customMaxPrice,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategoryId !== "all" ||
    selectedPriceRange !== "all" ||
    inStockOnly ||
    selectedBrand !== "all" ||
    customMinPrice !== "" ||
    customMaxPrice !== "";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
    setSelectedPriceRange("all");
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setInStockOnly(false);
    setSelectedBrand("all");
    const newParams = new URLSearchParams();
    setSearchParams(newParams, { replace: true });
  };

  // Quick Add to Cart
  const handleQuickAddToCart = (product: DisplayProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const availableVariant =
      product.variants.find((v) => v.quantity > 0) || product.variants[0];

    if (!availableVariant) {
      toast.error("Sản phẩm hiện chưa có phiên bản khả dụng");
      return;
    }

    addItem({
      id: `${product.code}::${availableVariant.id}`,
      productCode: product.code,
      name: product.name,
      variantName: availableVariant.name,
      price: availableVariant.price,
      imageUrl: product.imageUrl,
      accent: product.accent,
    });

    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
      description: `${availableVariant.name} · ${formatPriceVND(availableVariant.price)}`,
    });
  };

  const selectedCategoryName =
    selectedCategoryId === "all"
      ? "Tất cả sản phẩm"
      : categories.find((c) => c.id === selectedCategoryId)?.name || "Danh mục";

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-[#fcfcf7] text-[#1c3a13] flex flex-col selection:bg-[#d3fa99] selection:text-[#1c3a13]">
      <Header roleTitle="Customer" />

      {/* Hero / Header Section */}
      <section className="border-b border-[#eeeee9] bg-[#fcfcf7] pt-12 pb-14 sm:pt-16 sm:pb-16 px-6 sm:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 font-[var(--font-seed-sans-mono)] text-[11px] uppercase tracking-[0.2em] text-[#666666] mb-6">
            <Link to="/" className="hover:text-[#1c3a13] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#1c3a13]">Cửa hàng mỹ phẩm</span>
            {selectedCategoryId !== "all" && (
              <>
                <span>/</span>
                <span className="text-[#1c3a13] font-medium">{selectedCategoryName}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1c3a13] text-[10px] font-medium uppercase tracking-[0.18em] text-[#1c3a13] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d3fa99]" />
                Hệ Vi Sinh &amp; Mỹ Phẩm Lâm Sàng
              </div>
              <h1
                className="text-[#1c3a13] leading-[1.1] tracking-[-0.02em]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(34px, 4.5vw, 54px)",
                }}
              >
                {selectedCategoryName}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] sm:text-[16px] leading-[1.7] text-[#666666]">
                Khám phá trọn bộ công thức chăm sóc da chuyên sâu — tối giản phụ gia, tôn trọng
                hàng rào sinh học và minh bạch từng hàm lượng hoạt chất.
              </p>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <span className="font-[var(--font-seed-sans-mono)] text-[13px] text-[#666666] bg-[#eeeee9] px-5 py-2.5 rounded-full">
                Tổng cộng: <strong className="text-[#1c3a13] font-medium">{filteredProducts.length}</strong> sản phẩm
              </span>
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[13px] font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Bộ lọc</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#d3fa99]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 xl:gap-20">
          {/* ========================================================= */}
          {/* DESKTOP SIDEBAR FILTER                                   */}
          {/* ========================================================= */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-[100px] space-y-10">
            {/* Sidebar Header & Clear button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#eeeee9]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 className="text-[14px] font-medium uppercase tracking-[0.12em] text-[#1c3a13]">
                  Bộ lọc sản phẩm
                </h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-[var(--font-seed-sans-mono)] uppercase tracking-wider text-[#666666] hover:text-[#1c3a13] underline underline-offset-2 transition-colors"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Quick Search */}
            <div className="space-y-2">
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Tìm trong cửa hàng
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên, mã hoặc hoạt chất..."
                  className="w-full bg-[#eeeee9]/70 hover:bg-[#eeeee9] focus:bg-[#fcfcf7] border border-transparent focus:border-[#1c3a13] rounded-full px-4 py-2.5 pl-9 text-[13px] text-[#1c3a13] placeholder-[#666666] outline-none transition-all"
                />
                <svg
                  className="w-4 h-4 absolute left-3 text-[#666666] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-[#666666] hover:text-[#1c3a13]"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-4">
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Danh mục
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-[13.5px] transition-colors text-left ${
                    selectedCategoryId === "all"
                      ? "bg-[#1c3a13] text-[#fcfcf7] font-medium"
                      : "text-[#1c3a13] hover:bg-[#eeeee9]"
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  <span
                    className={`font-[var(--font-seed-sans-mono)] text-[11px] px-2.5 py-0.5 rounded-full ${
                      selectedCategoryId === "all"
                        ? "bg-[#fcfcf7]/20 text-[#fcfcf7]"
                        : "bg-[#eeeee9] text-[#666666]"
                    }`}
                  >
                    {categoryCounts.get("all") || products.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  const count = categoryCounts.get(cat.id) || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-[13.5px] transition-colors text-left ${
                        isSelected
                          ? "bg-[#1c3a13] text-[#fcfcf7] font-medium"
                          : "text-[#1c3a13] hover:bg-[#eeeee9]"
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span
                        className={`font-[var(--font-seed-sans-mono)] text-[11px] px-2.5 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? "bg-[#fcfcf7]/20 text-[#fcfcf7]"
                            : "bg-[#eeeee9] text-[#666666]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4 pt-4 border-t border-[#eeeee9]">
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Khoảng giá
              </label>

              <div className="space-y-2">
                {[
                  { key: "all", label: "Tất cả mức giá" },
                  { key: "under-300", label: "Dưới 300.000₫" },
                  { key: "300-600", label: "300.000₫ – 600.000₫" },
                  { key: "600-1000", label: "600.000₫ – 1.000.000₫" },
                  { key: "over-1000", label: "Trên 1.000.000₫" },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => {
                      setSelectedPriceRange(tier.key as PriceRangeKey);
                      setCustomMinPrice("");
                      setCustomMaxPrice("");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13.5px] transition-colors flex items-center gap-3 ${
                      selectedPriceRange === tier.key
                        ? "bg-[#eeeee9] text-[#1c3a13] font-medium"
                        : "text-[#666666] hover:text-[#1c3a13] hover:bg-[#eeeee9]/50"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        selectedPriceRange === tier.key
                          ? "border-[#1c3a13] bg-[#1c3a13]"
                          : "border-[#b3b3b3]"
                      }`}
                    >
                      {selectedPriceRange === tier.key && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fcfcf7]" />
                      )}
                    </span>
                    <span>{tier.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom price inputs */}
              <div className="pt-2">
                <div className="text-[11px] font-medium text-[#666666] mb-2">
                  Tùy chỉnh khoảng giá (VND)
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="number"
                    value={customMinPrice}
                    onChange={(e) => {
                      setCustomMinPrice(e.target.value);
                      setSelectedPriceRange("custom");
                    }}
                    placeholder="Từ"
                    className="w-full bg-[#eeeee9]/60 focus:bg-[#fcfcf7] border border-transparent focus:border-[#1c3a13] rounded-xl px-3 py-2 text-[13px] font-[var(--font-seed-sans-mono)] outline-none"
                  />
                  <input
                    type="number"
                    value={customMaxPrice}
                    onChange={(e) => {
                      setCustomMaxPrice(e.target.value);
                      setSelectedPriceRange("custom");
                    }}
                    placeholder="Đến"
                    className="w-full bg-[#eeeee9]/60 focus:bg-[#fcfcf7] border border-transparent focus:border-[#1c3a13] rounded-xl px-3 py-2 text-[13px] font-[var(--font-seed-sans-mono)] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="pt-4 border-t border-[#eeeee9]">
              <label className="flex items-center justify-between cursor-pointer group py-1.5">
                <span className="text-[13.5px] text-[#1c3a13] group-hover:opacity-80 transition-opacity">
                  Chỉ hiện sản phẩm còn hàng
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1c3a13] accent-[#1c3a13] cursor-pointer"
                />
              </label>
            </div>

            {/* Brand filter if available */}
            {availableBrands.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#eeeee9]">
                <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                  Thương hiệu
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                      selectedBrand === "all"
                        ? "bg-[#1c3a13] text-[#fcfcf7]"
                        : "bg-[#eeeee9] text-[#666666] hover:text-[#1c3a13]"
                    }`}
                  >
                    Tất cả
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                        selectedBrand.toLowerCase() === brand.toLowerCase()
                          ? "bg-[#1c3a13] text-[#fcfcf7]"
                          : "bg-[#eeeee9] text-[#666666] hover:text-[#1c3a13]"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: TOOLBAR & PRODUCT GRID                      */}
          {/* ========================================================= */}
          <div className="flex-1 w-full space-y-8">
            {/* Top Toolbar: Active filter tags + Sort dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-[#eeeee9]">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[13.5px] text-[#666666]">
                  Hiển thị <strong className="text-[#1c3a13] font-medium">{filteredProducts.length}</strong> kết quả
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eeeee9] text-[12px] text-[#1c3a13]">
                    Từ khóa: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="hover:opacity-60 text-sm">×</button>
                  </span>
                )}

                {selectedCategoryId !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eeeee9] text-[12px] text-[#1c3a13]">
                    {selectedCategoryName}
                    <button onClick={() => handleCategorySelect("all")} className="hover:opacity-60 text-sm">×</button>
                  </span>
                )}

                {selectedPriceRange !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eeeee9] text-[12px] text-[#1c3a13]">
                    {selectedPriceRange === "under-300" && "< 300.000₫"}
                    {selectedPriceRange === "300-600" && "300k – 600k"}
                    {selectedPriceRange === "600-1000" && "600k – 1.000k"}
                    {selectedPriceRange === "over-1000" && "> 1.000.000₫"}
                    {selectedPriceRange === "custom" && `${customMinPrice || 0}₫ - ${customMaxPrice || "..."}₫`}
                    <button onClick={() => setSelectedPriceRange("all")} className="hover:opacity-60 text-sm">×</button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eeeee9] text-[12px] text-[#1c3a13]">
                    Còn hàng
                    <button onClick={() => setInStockOnly(false)} className="hover:opacity-60 text-sm">×</button>
                  </span>
                )}

                {selectedBrand !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eeeee9] text-[12px] text-[#1c3a13]">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand("all")} className="hover:opacity-60 text-sm">×</button>
                  </span>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sắp xếp sản phẩm"
                  className="bg-[#fcfcf7] border border-[#eeeee9] hover:border-[#1c3a13] rounded-full px-4 py-2.5 text-[13px] text-[#1c3a13] font-medium outline-none cursor-pointer transition-colors"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A → Z</option>
                  <option value="stock-desc">Còn hàng nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Product Grid Area */}
            {loading ? (
              // Skeleton Loader
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14 sm:gap-x-12 sm:gap-y-16">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-4 animate-pulse p-4 rounded-[24px] bg-[#eeeee9]/30">
                    <div className="aspect-[4/5] bg-[#eeeee9] rounded-[18px]" />
                    <div className="h-4 bg-[#eeeee9] rounded-full w-1/4 mt-4" />
                    <div className="h-6 bg-[#eeeee9] rounded-full w-3/4" />
                    <div className="h-4 bg-[#eeeee9] rounded-full w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // Empty State
              <div className="py-24 text-center border border-[#eeeee9] rounded-[24px] bg-[#eeeee9]/30 p-8">
                <div className="w-16 h-16 rounded-full bg-[#eeeee9] mx-auto flex items-center justify-center text-[#666666] mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3
                  className="text-[24px] text-[#1c3a13]"
                  style={{ fontWeight: 350 }}
                >
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] max-w-md mx-auto">
                  Hãy thử điều chỉnh lại bộ lọc, tìm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục sản phẩm.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1c3a13] text-[#fcfcf7] px-6 py-3 text-[13px] font-medium hover:opacity-90 transition-opacity"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              // Product Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 xl:gap-x-10 xl:gap-y-14">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.totalStock <= 0;
                  const priceDisplay =
                    product.minPrice === product.maxPrice
                      ? formatPriceVND(product.minPrice)
                      : `Từ ${formatPriceVND(product.minPrice)}`;

                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col justify-between rounded-[24px] p-4 sm:p-5 bg-[#eeeee9]/25 hover:bg-[#eeeee9]/50 border border-transparent hover:border-[#eeeee9] transition-all duration-300"
                    >
                      {/* Visual & Link Container */}
                      <Link
                        to={`/product/${encodeURIComponent(product.code)}`}
                        className="flex flex-col"
                      >
                        {/* Image Canvas with Seed 18px radius */}
                        <div
                          className="aspect-[4/5] rounded-[18px] flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-1.5"
                          style={{ backgroundColor: product.accent }}
                        >
                          {/* Badges Overlay */}
                          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                            {product.isNew && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d3fa99] text-[#1c3a13] text-[10px] font-semibold uppercase tracking-[0.14em]">
                                Mới
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fcfcf7]/90 text-[#1c3a13] text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur-[6px]">
                                Bán chạy
                              </span>
                            )}
                          </div>

                          {isOutOfStock && (
                            <div className="absolute top-3.5 right-3.5 z-10">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1c3a13]/80 text-[#fcfcf7] text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur-[6px]">
                                Tạm hết hàng
                              </span>
                            </div>
                          )}

                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            /* Laboratory Orb Specimen Placeholder */
                            <div
                              className="w-1/2 aspect-square rounded-full transition-transform duration-700 group-hover:scale-110 flex items-center justify-center"
                              style={{
                                backgroundColor: "rgba(252,252,247,0.14)",
                                backdropFilter: "blur(16px)",
                                boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.06)",
                              }}
                            >
                              <span className="font-sans text-[32px] font-light text-[#fcfcf7]/60 uppercase">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="mt-6 flex flex-col">
                          {/* Specimen Code Pill */}
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#1c3a13]/40 font-[var(--font-seed-sans-mono)] text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#1c3a13]">
                              {product.code}
                            </span>
                            {product.variants.length > 1 && (
                              <span className="text-[12px] text-[#666666]">
                                {product.variants.length} tùy chọn
                              </span>
                            )}
                          </div>

                          {/* Product Name */}
                          <h3
                            className="text-[18px] text-[#1c3a13] group-hover:opacity-80 transition-opacity line-clamp-1 leading-[1.4]"
                            style={{ fontWeight: 400 }}
                          >
                            {product.name}
                          </h3>

                          {/* Description snippet */}
                          {product.description && (
                            <p className="mt-2 text-[13.5px] text-[#666666] line-clamp-2 leading-[1.6]">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </Link>

                      {/* Footer: Price & Quick Action */}
                      <div className="mt-6 pt-4 border-t border-[#eeeee9] flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-[#666666] uppercase tracking-wider">
                            Giá niêm yết
                          </span>
                          <span className="font-[var(--font-seed-sans-mono)] text-[17px] font-semibold text-[#1c3a13]">
                            {product.minPrice > 0 ? priceDisplay : "Liên hệ"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Link
                            to={`/product/${encodeURIComponent(product.code)}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#1c3a13] text-[12.5px] font-medium text-[#1c3a13] hover:bg-[#1c3a13] hover:text-[#fcfcf7] transition-all"
                          >
                            Chi tiết
                          </Link>

                          {!isOutOfStock ? (
                            <button
                              onClick={(e) => handleQuickAddToCart(product, e)}
                              title="Thêm nhanh vào giỏ hàng"
                              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1c3a13] text-[#fcfcf7] hover:opacity-85 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </button>
                          ) : (
                            <span className="inline-flex items-center justify-center px-3.5 py-2 rounded-full bg-[#eeeee9] text-[11px] font-medium text-[#666666] cursor-not-allowed">
                              Hết hàng
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* MOBILE FILTER DRAWER                                      */}
      {/* ========================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-[#fcfcf7] h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeeee9]">
              <h3 className="text-[16px] font-medium text-[#1c3a13]">Bộ lọc sản phẩm</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#666666] hover:bg-[#eeeee9]"
              >
                ✕
              </button>
            </div>

            {/* Quick search mobile */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666] mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tên sản phẩm..."
                className="w-full bg-[#eeeee9] rounded-full px-4 py-2 text-[13px] outline-none"
              />
            </div>

            {/* Categories mobile */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666] mb-2">
                Danh mục
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect("all");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex justify-between ${
                    selectedCategoryId === "all" ? "bg-[#1c3a13] text-[#fcfcf7]" : "text-[#1c3a13]"
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex justify-between ${
                      selectedCategoryId === cat.id ? "bg-[#1c3a13] text-[#fcfcf7]" : "text-[#1c3a13]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>{categoryCounts.get(cat.id) || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price mobile */}
            <div>
              <label className="block text-[12px] font-medium uppercase tracking-wider text-[#666666] mb-2">
                Mức giá
              </label>
              <div className="space-y-1">
                {[
                  { key: "all", label: "Tất cả mức giá" },
                  { key: "under-300", label: "Dưới 300.000₫" },
                  { key: "300-600", label: "300.000₫ – 600.000₫" },
                  { key: "600-1000", label: "600.000₫ – 1.000.000₫" },
                  { key: "over-1000", label: "Trên 1.000.000₫" },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setSelectedPriceRange(tier.key as PriceRangeKey)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] ${
                      selectedPriceRange === tier.key ? "bg-[#1c3a13] text-[#fcfcf7]" : "text-[#1c3a13]"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock mobile */}
            <div className="pt-2 border-t border-[#eeeee9]">
              <label className="flex items-center justify-between text-[13px] py-2 cursor-pointer">
                <span>Chỉ hiện còn hàng</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#1c3a13]"
                />
              </label>
            </div>

            {/* Actions footer */}
            <div className="pt-4 border-t border-[#eeeee9] flex gap-2 mt-auto">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-full border border-[#1c3a13] text-[13px] font-medium text-[#1c3a13]"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#1c3a13] text-[13px] font-medium text-[#fcfcf7]"
              >
                Xem {filteredProducts.length} SP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Minimal */}
      <footer className="w-full bg-[#fcfcf7] border-t border-[#eeeee9] mt-20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[#666666]">
          <p>© 2026 Guardian Skincare Inc. — Botanical Clinical Systems</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#1c3a13] transition-colors">
              Về trang chủ
            </Link>
            <a href="#top" className="hover:text-[#1c3a13] transition-colors">
              Lên đầu trang ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopPage;
