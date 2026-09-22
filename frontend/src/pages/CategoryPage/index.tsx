import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import {
  productsService,
  type CategorySummary,
} from "../../services/products.service";

interface CategoryItem {
  code: string;
  name: string;
  price: string;
  imageUrl: string | null;
  accent: string;
}

const ACCENTS = ["#1c3a13", "#9f995b", "#757c5d", "#698e79"];

const formatPrice = (value: number): string =>
  `${value.toLocaleString("vi-VN")}₫`;

const accentFor = (code: string): string => {
  let hash = 0;
  for (const ch of code) {
    hash = (hash + ch.charCodeAt(0)) % ACCENTS.length;
  }
  return ACCENTS[hash];
};

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = id ?? "";

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategorySummary | null>(null);
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [cats, cosmetics] = await Promise.all([
          productsService.getCategories().catch(() => [] as CategorySummary[]),
          productsService.getCosmetics().catch(() => []),
        ]);

        const cat = cats.find((c) => c.id === categoryId) ?? null;

        const details = await Promise.all(
          cosmetics
            .filter((c) => c.isActive)
            .map((c) =>
              productsService.getCosmeticById(c.id).catch(() => null),
            ),
        );

        const list: CategoryItem[] = [];
        for (const detail of details) {
          if (!detail || !detail.categoryIds.includes(categoryId)) {
            continue;
          }
          const first = detail.variants.filter((v) => v.isActive)[0];
          const price = first?.price ?? 0;
          list.push({
            code: detail.code,
            name: detail.name,
            price: price > 0 ? formatPrice(price) : "Liên hệ",
            imageUrl: detail.imageUrl,
            accent: accentFor(detail.code),
          });
        }

        if (active) {
          setCategory(cat);
          setItems(list);
        }
      } catch {
        if (active) {
          setCategory(null);
          setItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [categoryId]);

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col">
      <Header roleTitle="Customer" />

      <main className="flex-1">
        <div className="px-6 sm:px-12 py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto">
            <nav className="flex items-center gap-2 font-[var(--font-seed-sans-mono)] text-[11px] uppercase tracking-[0.2em] text-[#666666] mb-4">
              <Link to="/" className="hover:text-[#1c3a13] transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-[#1c3a13] transition-colors">
                Cửa hàng
              </Link>
              <span>/</span>
              <span className="text-[#1c3a13]">{category?.name ?? "Danh mục"}</span>
            </nav>
            <h1
              className="text-forest-depths"
              style={{
                fontWeight: 350,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {category?.name ?? "Sản phẩm"}
            </h1>
            {category?.description && (
              <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-pewter">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 sm:px-12 pb-24 sm:pb-32">
          <div className="max-w-[1200px] mx-auto">
            {loading ? (
              <p className="text-[14px] text-pewter">Đang tải…</p>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-[24px] text-forest-depths" style={{ fontWeight: 350 }}>
                  Chưa có sản phẩm trong danh mục này
                </h2>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-6 py-3 text-[14px]"
                  >
                    Xem tất cả sản phẩm
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full border border-forest-depths text-forest-depths px-6 py-3 text-[14px]"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                  <Link
                    key={item.code}
                    to={`/product/${encodeURIComponent(item.code)}`}
                    className="group flex flex-col cursor-pointer"
                  >
                    <div
                      className="aspect-[4/5] rounded-[20px] mb-6 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
                      style={{ backgroundColor: item.accent }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-1/2 aspect-square rounded-full transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundColor: "rgba(252,252,247,0.12)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.05)",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-[var(--font-seed-sans-mono)] text-[10px] font-medium uppercase tracking-[0.15em] text-pewter mb-2">
                        {item.code}
                      </span>
                      <h3
                        className="text-[18px] text-forest-depths mb-2 group-hover:opacity-80 transition-opacity"
                        style={{ fontWeight: 400 }}
                      >
                        {item.name}
                      </h3>
                      <p className="font-[var(--font-seed-sans-mono)] text-[15px] font-medium text-forest-depths mt-auto">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full bg-snow-white border-t border-warm-stone">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-pewter">
          <p>© 2026 Guardian Skincare Inc.</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-forest-depths transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;