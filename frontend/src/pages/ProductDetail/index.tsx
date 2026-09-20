import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/Header";
import {
  productsService,
  type CategorySummary,
  type CosmeticDetail,
} from "../../services/products.service";
import {
  useCartStore,
  parsePrice,
} from "../../store/useCartStore";

const PRODUCTS_DB = {
  "DS-01®": {
    name: "Sữa rửa mặt vi sinh",
    price: "420.000₫",
    accent: "#1c3a13",
    desc: "Sữa rửa mặt tạo bọt mịn chứa prebiotics giúp cân bằng độ pH và bảo vệ hệ vi sinh tự nhiên của da ngay từ bước làm sạch đầu tiên.",
    longDesc: [
      "Sữa rửa mặt DS-01® được thiết kế chuyên biệt để bảo vệ và nuôi dưỡng hệ vi sinh tự nhiên trên da. Với độ pH 5.5 lý tưởng, sản phẩm không chỉ làm sạch sâu lỗ chân lông mà còn giữ lại lớp màng ẩm tự nhiên, mang lại cảm giác mềm mại, không khô căng sau khi rửa.",
      "Sự kết hợp hoàn hảo giữa chiết xuất thực vật và công nghệ prebiotic tiên tiến giúp cân bằng hệ vi sinh, làm dịu các vùng da nhạy cảm và tăng cường sức đề kháng cho da trước các tác nhân gây hại từ môi trường."
    ],
    specs: ["pH 5.5", "Dịu nhẹ", "Mọi loại da"],
    variants: [
      { id: "150ml", name: "150ml - Tiêu chuẩn", price: "420.000₫" },
      { id: "300ml", name: "300ml - Tiết kiệm", price: "750.000₫" },
    ]
  },
  "AM-02™": {
    name: "Tinh chất sáng da ban ngày",
    price: "680.000₫",
    accent: "#9f995b",
    desc: "Tinh chất giàu vitamin C và chất chống oxy hóa, bảo vệ da khỏi tác động môi trường và mang lại làn da rạng rỡ suốt cả ngày.",
    longDesc: [
      "AM-02™ là giải pháp toàn diện cho làn da sạm màu và thiếu sức sống. Chứa nồng độ cao Vitamin C tinh khiết kết hợp cùng Niacinamide, tinh chất giúp ức chế sản sinh melanin, làm mờ thâm nám và dưỡng trắng da từ sâu bên trong.",
      "Công thức thẩm thấu nhanh, không gây nhờn rít, tạo lớp bảo vệ chống lại các gốc tự do và tia UV, giữ cho làn da luôn tươi trẻ và rạng rỡ rạng ngời."
    ],
    specs: ["Thẩm thấu nhanh", "Sáng da", "Ban ngày"],
    variants: [
      { id: "30ml", name: "30ml - Tiêu chuẩn", price: "680.000₫" },
      { id: "50ml", name: "50ml - Lớn", price: "950.000₫" },
    ]
  },
  "DM-02™": {
    name: "Huyết thanh cân bằng",
    price: "590.000₫",
    accent: "#757c5d",
    desc: "Huyết thanh phục hồi chuyên sâu, cung cấp độ ẩm tức thì và củng cố hàng rào bảo vệ da mạnh mẽ hơn.",
    longDesc: [
      "Được bào chế đặc biệt cho làn da đang chịu tổn thương hoặc nhạy cảm, DM-02™ cung cấp nguồn dưỡng chất dồi dào giúp phục hồi cấu trúc da nhanh chóng. Thành phần chứa chiết xuất Centella Asiatica và Panthenol (B5) làm dịu ngay lập tức các vết mẩn đỏ và kích ứng.",
      "Sử dụng đều đặn giúp hàng rào bảo vệ da trở nên vững chắc hơn, giảm thiểu tác động tiêu cực từ môi trường, mang lại làn da khỏe mạnh và đàn hồi."
    ],
    specs: ["Phục hồi", "Mọi loại da", "Lành tính"],
    variants: [
      { id: "30ml", name: "30ml - Tiêu chuẩn", price: "590.000₫" }
    ]
  },
  "PM-02™": {
    name: "Kem phục hồi ban đêm",
    price: "720.000₫",
    accent: "#698e79",
    desc: "Kem dưỡng khóa ẩm ban đêm với peptide nuôi dưỡng chuyên sâu, kích thích quá trình tự phục hồi của da trong lúc bạn ngủ.",
    longDesc: [
      "PM-02™ khai thác tối đa khoảng thời gian vàng vào ban đêm khi da thực hiện quá trình tái tạo mạnh mẽ nhất. Chứa phức hợp đa peptide và ceramide, kem dưỡng tạo thành một màng chắn giữ ẩm hoàn hảo, ngăn ngừa mất nước qua da.",
      "Thức dậy với làn da căng mọng, mịn màng và tràn đầy sức sống. Sản phẩm còn hỗ trợ làm mờ các nếp nhăn li ti và tăng sinh collagen tự nhiên."
    ],
    specs: ["Khóa ẩm", "Chống lão hóa", "Ban đêm"],
    variants: [
      { id: "50ml", name: "50ml - Tiêu chuẩn", price: "720.000₫" },
      { id: "100ml", name: "100ml - Lớn", price: "1.200.000₫" }
    ]
  },
  "EX-01™": {
    name: "Tẩy tế bào chết hoá học",
    price: "450.000₫",
    accent: "#8b7e74",
    desc: "Dung dịch tẩy da chết với 2% BHA giúp làm sạch sâu lỗ chân lông, ngăn ngừa mụn và cải thiện bề mặt da.",
    longDesc: [
      "EX-01™ là tinh chất tẩy tế bào chết hóa học chứa nồng độ 2% BHA (Salicylic Acid) an toàn và hiệu quả, len lỏi sâu vào lỗ chân lông để hòa tan bã nhờn.",
      "Sản phẩm còn được bổ sung chiết xuất trà xanh làm dịu, giúp tẩy tế bào chết mà không gây kích ứng, mang lại làn da láng mịn và tươi sáng."
    ],
    specs: ["Làm sạch sâu", "Giảm mụn", "Mọi loại da"],
    variants: [
      { id: "100ml", name: "100ml - Tiêu chuẩn", price: "450.000₫" }
    ]
  }
};

const StaticProductDetail = ({ code }: { code: string }) => {
  
  const decodedCode = code ? decodeURIComponent(code) : "";
  const product = PRODUCTS_DB[decodedCode as keyof typeof PRODUCTS_DB];

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] text-forest-depths" style={{ fontWeight: 350 }}>Sản phẩm không tồn tại</h1>
            <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-6 py-3 text-[14px]">
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const currentPrice = selectedVariant?.price || product.price;

  const addCurrentToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: `${decodedCode}::${selectedVariant.id}`,
      productCode: decodedCode,
      name: product.name,
      variantName: selectedVariant.name,
      price: parsePrice(selectedVariant.price),
      accent: product.accent,
    });
  };

  const relatedProducts = Object.entries(PRODUCTS_DB)
    .filter(([key]) => key !== decodedCode)
    .slice(0, 4);

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white">
      <Header roleTitle="Customer" />

      {/* Hero section */}
      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Product Visual */}
          <div 
            className="aspect-[4/5] rounded-[24px] flex items-center justify-center relative overflow-hidden sticky top-24"
            style={{ backgroundColor: product.accent }}
          >
            <div
              className="w-1/2 aspect-square rounded-full transition-transform duration-700 hover:scale-110"
              style={{
                backgroundColor: "rgba(252,252,247,0.12)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)"
              }}
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-forest-depths font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.2em] text-forest-depths">
                {decodedCode}
              </span>
              {product.variants.length > 1 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-warm-stone text-[12px] font-medium uppercase tracking-[0.1em] text-forest-depths">
                  {product.variants.length} Tùy chọn
                </span>
              )}
            </div>

            <h1 
              className="mt-6 text-forest-depths"
              style={{
                fontWeight: 350,
                fontSize: "clamp(40px, 4.5vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              {product.name}
            </h1>

            <p className="mt-6 text-[18px] leading-[1.6] text-pewter max-w-lg">
              {product.desc}
            </p>

            <div className="mt-8">
               <p className="font-[var(--font-seed-sans-mono)] text-[32px] font-medium text-forest-depths">
                {currentPrice}
               </p>
            </div>

            {/* Variants Selection */}
            {product.variants.length > 0 && (
              <div className="mt-10">
                <p className="text-[14px] font-medium text-forest-depths uppercase tracking-[0.1em] mb-4">
                  Dung tích / Kích cỡ
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-5 py-3 rounded-full text-[14px] font-medium transition-all duration-300 ${
                        selectedVariantId === variant.id
                          ? "bg-forest-depths text-white border-2 border-forest-depths"
                          : "bg-transparent text-forest-depths border-2 border-warm-stone hover:border-forest-depths hover:bg-forest-depths hover:text-white"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  addCurrentToCart();
                  navigate("/checkout");
                }}
                className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-forest-depths bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
              >
                Mua ngay
              </button>
              <button
                onClick={() => {
                  addCurrentToCart();
                  toast.success("Đã thêm vào giỏ hàng.");
                }}
                className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-forest-depths text-forest-depths px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:bg-forest-depths hover:text-white transition-all"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Specs */}
            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-warm-stone pt-8">
              {product.specs.map(s => (
                <div key={s} className="text-[13px] uppercase tracking-[0.15em] text-pewter font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-forest-depths opacity-40" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Product Description Section */}
      <section className="bg-warm-stone py-24 sm:py-32">
        <div className="max-w-[800px] mx-auto px-6 sm:px-12 text-center">
          <span className="inline-block mb-6 font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.2em] text-pewter">
            Chi tiết sản phẩm
          </span>
          <h2 
            className="text-forest-depths mb-12"
            style={{
              fontWeight: 350,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Hiệu quả sâu, bảo vệ toàn diện.
          </h2>
          
          <div className="space-y-6 text-left">
            {product.longDesc.map((paragraph, idx) => (
              <p key={idx} className="text-[18px] text-forest-depths opacity-80 leading-[1.8]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-24 sm:py-32 bg-snow-white border-t border-warm-stone">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between mb-12">
            <h2 
              className="text-forest-depths"
              style={{
                fontWeight: 350,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Sản phẩm liên quan.
            </h2>
            <Link to="/" className="text-[13px] font-medium uppercase tracking-[0.1em] text-forest-depths hover:opacity-70 transition-opacity">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(([productCode, item]) => (
              <Link 
                key={productCode} 
                to={`/product/${encodeURIComponent(productCode)}`}
                className="group flex flex-col cursor-pointer"
              >
                <div 
                  className="aspect-[4/5] rounded-[20px] mb-6 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
                  style={{ backgroundColor: item.accent }}
                >
                  <div
                    className="w-1/2 aspect-square rounded-full transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundColor: "rgba(252,252,247,0.12)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.05)"
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-[var(--font-seed-sans-mono)] text-[10px] font-medium uppercase tracking-[0.15em] text-pewter mb-2">
                    {productCode}
                  </span>
                  <h3 className="text-[18px] text-forest-depths mb-2 group-hover:opacity-80 transition-opacity" style={{ fontWeight: 400 }}>
                    {item.name}
                  </h3>
                  <p className="font-[var(--font-seed-sans-mono)] text-[15px] font-medium text-forest-depths mt-auto">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="w-full bg-snow-white">
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

const API_ACCENTS = ["#1c3a13", "#9f995b", "#757c5d", "#698e79"];

interface RelatedItem {
  code: string;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryIds: string[];
}

const formatPrice = (value: number): string =>
  `${value.toLocaleString("vi-VN")}₫`;

const accentFor = (code: string): string => {
  let hash = 0;
  for (const ch of code) {
    hash = (hash + ch.charCodeAt(0)) % API_ACCENTS.length;
  }
  return API_ACCENTS[hash];
};

const ApiProductDetail = ({ code }: { code: string }) => {
  const decodedCode = code;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<CosmeticDetail | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [related, setRelated] = useState<RelatedItem[]>([]);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [summaries, cats] = await Promise.all([
          productsService.getCosmetics(),
          productsService.getCategories().catch(() => [] as CategorySummary[]),
        ]);
        const found = summaries.find((s) => s.code === decodedCode);
        if (!found) {
          if (active) {
            setProduct(null);
          }
          return;
        }
        const detail = await productsService.getCosmeticById(found.id);

        const candidates = summaries.filter(
          (s) => s.isActive && s.id !== found.id,
        );
        const relatedList: RelatedItem[] = [];
        for (const c of candidates.slice(0, 12)) {
          try {
            const d = await productsService.getCosmeticById(c.id);
            if (!d || !d.isActive) continue;
            const activeVariant = d.variants.find(
              (v) => v.isActive && v.quantity > 0,
            );
            relatedList.push({
              code: d.code,
              name: d.name,
              price: activeVariant?.price ?? 0,
              imageUrl: d.imageUrl,
              categoryIds: d.categoryIds,
            });
          } catch {
            // Skip a sibling that fails to load; never break the product page.
          }
        }

        if (active) {
          setProduct(detail);
          setCategories(cats);
          setRelated(relatedList);
        }
      } catch {
        if (active) {
          setProduct(null);
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
  }, [decodedCode]);

  const activeVariants = useMemo(
    () => (product ? product.variants.filter((v) => v.isActive) : []),
    [product],
  );

  const selectedVariant =
    activeVariants.find((v) => v.id === selectedVariantId) ??
    activeVariants[0];

  const categoryNames =
    product?.categoryIds
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[14px] text-pewter">Đang tải…</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] text-forest-depths" style={{ fontWeight: 350 }}>Sản phẩm không tồn tại</h1>
            <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-6 py-3 text-[14px]">
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const price = selectedVariant ? formatPrice(selectedVariant.price) : "Liên hệ";
  const accent = accentFor(product.code);

  const addCurrentToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      productCode: product.code,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      imageUrl: product.imageUrl,
      accent,
    });
  };

  const orderedRelated = related
    .map((r) => ({
      ...r,
      score: product.categoryIds.filter((id) => r.categoryIds.includes(id))
        .length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const specs = [
    ...(selectedVariant?.volume ? [selectedVariant.volume] : []),
    ...(selectedVariant?.color ? [selectedVariant.color] : []),
    ...categoryNames,
    ...(product.brand ? [product.brand] : []),
    ...(product.origin ? [product.origin] : []),
  ];

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white">
      <Header roleTitle="Customer" />

      {/* Hero section */}
      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Product Visual */}
          <div
            className="aspect-[4/5] rounded-[24px] flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: accent }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-1/2 aspect-square rounded-full transition-transform duration-700 hover:scale-110"
                style={{
                  backgroundColor: "rgba(252,252,247,0.12)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-forest-depths font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.2em] text-forest-depths">
                {product.code}
              </span>
              {activeVariants.length > 1 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-warm-stone text-[12px] font-medium uppercase tracking-[0.1em] text-forest-depths">
                  {activeVariants.length} Tùy chọn
                </span>
              )}
            </div>

            <h1
              className="mt-6 text-forest-depths"
              style={{
                fontWeight: 350,
                fontSize: "clamp(40px, 4.5vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              {product.name}
            </h1>

            <p className="mt-6 text-[18px] leading-[1.6] text-pewter max-w-lg">
              {product.description ?? "Mỹ phẩm được bào chế theo phương pháp lâm sàng — an toàn cho làn da nhạy cảm."}
            </p>

            <div className="mt-8">
              <p className="font-[var(--font-seed-sans-mono)] text-[32px] font-medium text-forest-depths">
                {price}
              </p>
            </div>

            {activeVariants.length > 0 && (
              <div className="mt-10">
                <p className="text-[14px] font-medium text-forest-depths uppercase tracking-[0.1em] mb-4">
                  Dung tích / Kích cỡ
                </p>
                <div className="flex flex-wrap gap-3">
                  {activeVariants.map((variant) => {
                    const isSelected = variant.id === (selectedVariant?.id ?? null);
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-5 py-3 rounded-full text-[14px] font-medium transition-all duration-300 ${
                          isSelected
                            ? "bg-forest-depths text-white border-2 border-forest-depths"
                            : "bg-transparent text-forest-depths border-2 border-warm-stone hover:border-forest-depths hover:bg-forest-depths hover:text-white"
                        }`}
                      >
                        {variant.name}
                        {variant.volume ? ` - ${variant.volume}` : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  addCurrentToCart();
                  navigate("/checkout");
                }}
                disabled={!selectedVariant}
                className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-forest-depths bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
              <button
                onClick={() => {
                  addCurrentToCart();
                  toast.success("Đã thêm vào giỏ hàng.");
                }}
                disabled={!selectedVariant}
                className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-forest-depths text-forest-depths px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:bg-forest-depths hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            {specs.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-warm-stone pt-8">
                {specs.map((spec) => (
                  <div key={spec} className="text-[13px] uppercase tracking-[0.15em] text-pewter font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest-depths opacity-40" />
                    {spec}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Variants Section */}
      {product.variants.length > 0 && (
        <section className="bg-warm-stone py-24 sm:py-32">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
            <div className="max-w-2xl mb-16">
              <span className="inline-block mb-6 font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.2em] text-pewter">
                Chi tiết sản phẩm
              </span>
              <h2
                className="text-forest-depths"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Biến thể sản phẩm.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-snow-white p-8 rounded-[16px] flex flex-col gap-4"
                >
                  <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full border border-forest-depths font-[var(--font-seed-sans-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-forest-depths">
                    {product.code}
                  </span>
                  <h3
                    className="text-forest-depths"
                    style={{
                      fontWeight: 350,
                      fontSize: "24px",
                      lineHeight: 1.15,
                      letterSpacing: "-0.48px",
                    }}
                  >
                    {variant.name}
                  </h3>
                  <p className="text-[14px] leading-[1.55] text-pewter">
                    {[variant.volume, variant.color].filter(Boolean).join(" · ") || "Mặc định"}
                  </p>
                  <p className="font-[var(--font-seed-sans-mono)] text-[20px] font-medium text-forest-depths">
                    {formatPrice(variant.price)}
                  </p>
                  <div className="mt-auto pt-4 border-t border-warm-stone">
                    <p className="font-[var(--font-seed-sans-mono)] text-[12px] text-forest-depths/70">
                      {variant.isActive
                        ? variant.quantity > 0
                          ? `Còn ${variant.quantity} sản phẩm`
                          : "Hết hàng"
                        : "Tạm ngừng kinh doanh"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {orderedRelated.length > 0 && (
        <section className="py-24 sm:py-32 bg-snow-white border-t border-warm-stone">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
            <div className="flex items-center justify-between mb-12">
              <h2
                className="text-forest-depths"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Sản phẩm liên quan.
              </h2>
              <Link to="/" className="text-[13px] font-medium uppercase tracking-[0.1em] text-forest-depths hover:opacity-70 transition-opacity">
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {orderedRelated.map((item) => (
                <Link
                  key={item.code}
                  to={`/product/${encodeURIComponent(item.code)}`}
                  className="group flex flex-col cursor-pointer"
                >
                  <div
                    className="aspect-[4/5] rounded-[20px] mb-6 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ backgroundColor: accentFor(item.code) }}
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
                    <h3 className="text-[18px] text-forest-depths mb-2 group-hover:opacity-80 transition-opacity" style={{ fontWeight: 400 }}>
                      {item.name}
                    </h3>
                    <p className="font-[var(--font-seed-sans-mono)] text-[15px] font-medium text-forest-depths mt-auto">
                      {item.price > 0 ? formatPrice(item.price) : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer minimal */}
      <footer className="w-full bg-snow-white">
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

const ProductDetail = () => {
  const { code } = useParams<{ code: string }>();

  const decodedCode = code ? decodeURIComponent(code) : "";

  if (PRODUCTS_DB[decodedCode as keyof typeof PRODUCTS_DB]) {
    return <StaticProductDetail code={decodedCode} />;
  }

  return <ApiProductDetail code={decodedCode} />;
};

export default ProductDetail;
