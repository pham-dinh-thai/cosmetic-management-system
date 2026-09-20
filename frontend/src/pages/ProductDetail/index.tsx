import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header";

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

const ProductDetail = () => {
  const { code } = useParams<{ code: string }>();
  
  const decodedCode = code ? decodeURIComponent(code) : "";
  const product = PRODUCTS_DB[decodedCode as keyof typeof PRODUCTS_DB];

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

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
                className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-forest-depths bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
              >
                Mua ngay
              </button>
              <button 
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

export default ProductDetail;
