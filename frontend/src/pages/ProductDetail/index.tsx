import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header";

const PRODUCTS_DB = {
  "DS-01®": {
    name: "Sữa rửa mặt vi sinh",
    price: "420.000₫",
    accent: "#1c3a13",
    desc: "Sữa rửa mặt tạo bọt mịn chứa prebiotics giúp cân bằng độ pH và bảo vệ hệ vi sinh tự nhiên của da ngay từ bước làm sạch đầu tiên.",
    specs: ["150ml", "pH 5.5", "Dịu nhẹ"],
    ingredients: [
      { code: "ING-001", name: "Prebiotic Complex", desc: "Hỗn hợp prebiotic từ rễ cây bồ công anh và inulin, nuôi dưỡng vi khuẩn có lợi trên da.", spec: "5% w/w · pH 5.5 · Vegan" },
      { code: "ING-002", name: "Glycerin tinh khiết", desc: "Giữ ẩm tự nhiên, không làm khô da sau khi rửa.", spec: "Thực vật · Dược điển" }
    ]
  },
  "AM-02™": {
    name: "Tinh chất sáng da ban ngày",
    price: "680.000₫",
    accent: "#9f995b",
    desc: "Tinh chất giàu vitamin C và chất chống oxy hóa, bảo vệ da khỏi tác động môi trường và mang lại làn da rạng rỡ suốt cả ngày.",
    specs: ["30ml", "Thẩm thấu nhanh", "Sáng da"],
    ingredients: [
      { code: "ING-014", name: "Niacinamide 5%", desc: "Dạng vitamin B3 tinh khiết — làm đều tông da, giảm tiết dầu, củng cố hàng rào bảo vệ.", spec: "5% w/w · Mỹ phẩm · ISO 16128" },
      { code: "ING-015", name: "Vitamin C", desc: "Dẫn xuất Vitamin C ổn định giúp làm sáng và đều màu da.", spec: "10% w/w · EAA" }
    ]
  },
  "DM-02™": {
    name: "Huyết thanh cân bằng",
    price: "590.000₫",
    accent: "#757c5d",
    desc: "Huyết thanh phục hồi chuyên sâu, cung cấp độ ẩm tức thì và củng cố hàng rào bảo vệ da mạnh mẽ hơn.",
    specs: ["30ml", "Phục hồi", "Mọi loại da"],
    ingredients: [
      { code: "ING-027", name: "Centella Asiatica", desc: "Chiết xuất rau má tiêu chuẩn hóa, làm dịu và phục hồi làn da nhạy cảm.", spec: "Madecassoside 0.5% · COSMOS" },
      { code: "ING-028", name: "Panthenol", desc: "Vitamin B5 giúp làm dịu và kích thích quá trình tái tạo tế bào.", spec: "5% w/w" }
    ]
  },
  "PM-02™": {
    name: "Kem phục hồi ban đêm",
    price: "720.000₫",
    accent: "#698e79",
    desc: "Kem dưỡng khóa ẩm ban đêm với peptide nuôi dưỡng chuyên sâu, kích thích quá trình tự phục hồi của da trong lúc bạn ngủ.",
    specs: ["50ml", "Khóa ẩm", "Chống lão hóa"],
    ingredients: [
      { code: "ING-041", name: "Peptide Complex", desc: "Phức hợp đa peptide giúp tăng sinh collagen và cải thiện độ đàn hồi.", spec: "Ma trận ngoại bào" },
      { code: "ING-042", name: "Ceramide NP", desc: "Lipid sinh học tương thích với da, củng cố lớp khóa ẩm.", spec: "Thực vật" }
    ]
  }
};

const ProductDetail = () => {
  const { code } = useParams<{ code: string }>();
  
  const decodedCode = code ? decodeURIComponent(code) : "";
  const product = PRODUCTS_DB[decodedCode as keyof typeof PRODUCTS_DB];

  if (!product) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-[--color-snow-white] flex flex-col">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] text-[--color-forest-depths]" style={{ fontWeight: 350 }}>Sản phẩm không tồn tại</h1>
            <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-[--color-forest-depths] text-[--color-snow-white] px-6 py-3 text-[14px]">
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-[--color-snow-white]">
      <Header roleTitle="Customer" />

      {/* Hero section */}
      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Product Visual */}
          <div 
            className="aspect-[4/5] rounded-[32px] flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: product.accent }}
          >
            <div
              className="w-1/2 aspect-square rounded-full"
              style={{
                backgroundColor: "rgba(252,252,247,0.18)",
                backdropFilter: "blur(20px)",
              }}
            />
          </div>

          {/* Right: Product Info */}
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full border-[1.5px] border-[--color-forest-depths] font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.2em] text-[--color-forest-depths]">
              {decodedCode}
            </span>

            <h1 
              className="mt-6 text-[--color-forest-depths]"
              style={{
                fontWeight: 350,
                fontSize: "clamp(40px, 5vw, 56px)",
                lineHeight: 1.1,
                letterSpacing: "-0.72px",
              }}
            >
              {product.name}
            </h1>

            <p className="mt-6 text-[18px] leading-[1.6] text-[--color-pewter] max-w-md">
              {product.desc}
            </p>

            <p className="mt-8 font-[var(--font-seed-sans-mono)] text-[24px] font-medium text-[--color-forest-depths]">
              {product.price}
            </p>

            <div className="mt-10">
              <button 
                className="inline-flex items-center justify-center rounded-full bg-[--color-forest-depths] text-[--color-snow-white] px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-90 transition-opacity"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[--color-warm-stone] pt-8">
              {product.specs.map(s => (
                <div key={s} className="text-[12px] uppercase tracking-[0.18em] text-[--color-pewter] font-medium">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Ingredients Section */}
      <section className="bg-[--color-warm-stone] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          <div className="max-w-2xl mb-16">
            <h2 
              className="text-[--color-forest-depths]"
              style={{
                fontWeight: 350,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Thành phần cốt lõi.
            </h2>
            <p className="mt-4 text-[16px] text-[--color-pewter] leading-[1.6]">
              Công thức minh bạch, không chứa hương liệu tổng hợp, an toàn cho hệ vi sinh trên da.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.ingredients.map(ing => (
              <div 
                key={ing.code}
                className="bg-[--color-snow-white] p-8 rounded-[16px] flex flex-col gap-4"
              >
                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full border border-[--color-forest-depths] font-[var(--font-seed-sans-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-[--color-forest-depths]">
                  {ing.code}
                </span>
                <h3 
                  className="text-[--color-forest-depths]"
                  style={{
                    fontWeight: 350,
                    fontSize: "24px",
                    lineHeight: 1.15,
                    letterSpacing: "-0.48px",
                  }}
                >
                  {ing.name}
                </h3>
                <p className="text-[16px] leading-[1.55] text-[--color-pewter]">
                  {ing.desc}
                </p>
                <div className="mt-auto pt-4 border-t border-[--color-warm-stone]">
                  <p className="font-[var(--font-seed-sans-mono)] text-[12px] text-[--color-forest-depths]/70">
                    {ing.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="w-full border-t border-[--color-warm-stone] bg-[--color-snow-white]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[--color-pewter]">
            <p>© 2026 Guardian Skincare Inc.</p>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-[--color-forest-depths]">
                Về trang chủ
              </Link>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default ProductDetail;
