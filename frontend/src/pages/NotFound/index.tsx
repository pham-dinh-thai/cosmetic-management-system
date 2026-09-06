import { Link } from "react-router-dom";
import Header from "../../components/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-[--color-snow-white] flex flex-col">
      <Header roleTitle="Customer" />

      <main className="flex-1 flex items-center justify-center px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — 404 display + message */}
            <div className="text-left">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[--color-pewter]">
                Lỗi
              </p>

              <h1
                className="mt-4 text-[--color-forest-depths] leading-[1.05] tracking-[-0.02em]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(64px, 10vw, 120px)",
                  letterSpacing: "-0.02em",
                }}
              >
                404
              </h1>

              <p className="mt-4 text-[20px] leading-[1.3] tracking-[-0.02em] text-[--color-forest-depths]" style={{ fontWeight: 350 }}>
                Trang không tìm thấy.
              </p>

              <p className="mt-6 max-w-md text-[16px] leading-[1.6] text-[--color-pewter]">
                Trang bạn đang tìm kiếm không còn tồn tại hoặc chưa được tạo ra.
                Quay lại trang chủ để khám phá bộ sưu tập sản phẩm của chúng tôi.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-[--color-forest-depths] text-[--color-snow-white] px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-90 transition-opacity"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>

            {/* Right — botanical-clinical illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                className="relative aspect-square w-full max-w-[400px] rounded-[32px] overflow-hidden"
                style={{ backgroundColor: "#1c3a13" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(211,250,153,0.18), transparent 55%), radial-gradient(circle at 80% 75%, rgba(105,142,121,0.35), transparent 60%)",
                  }}
                />
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden
                >
                  <g
                    fill="none"
                    stroke="#d3fa99"
                    strokeWidth="1.2"
                    opacity="0.5"
                  >
                    <path d="M200 360 Q 200 280 160 240 Q 120 200 110 140" />
                    <path d="M160 240 Q 140 220 130 180" />
                    <path d="M160 240 Q 200 220 230 190" />
                    <path d="M200 280 Q 240 260 270 220" />
                    <path d="M270 220 Q 300 200 320 160" />
                    <path d="M270 220 Q 280 190 260 160" />
                    <path d="M110 140 Q 90 120 95 90" />
                    <path d="M110 140 Q 130 120 145 100" />
                    <path d="M200 360 Q 220 330 215 300" />
                    <path d="M215 300 Q 235 270 230 240" />
                    <path d="M230 240 Q 260 230 280 210" />
                    <path d="M230 240 Q 210 220 195 200" />
                  </g>
                  <g fill="#d3fa99">
                    <circle cx="110" cy="140" r="3.5" />
                    <circle cx="160" cy="240" r="4" />
                    <circle cx="270" cy="220" r="3.5" />
                    <circle cx="200" cy="280" r="3" />
                    <circle cx="230" cy="240" r="3.5" />
                    <circle cx="215" cy="300" r="2.5" />
                    <circle cx="95" cy="90" r="2" />
                    <circle cx="130" cy="180" r="2" />
                    <circle cx="320" cy="160" r="2" />
                    <circle cx="260" cy="160" r="2" />
                  </g>
                  <g
                    fill="none"
                    stroke="#698e79"
                    strokeWidth="1"
                    opacity="0.4"
                  >
                    <path d="M110 140 Q 155 180 200 150" />
                    <path d="M200 280 Q 180 240 160 220" />
                  </g>
                </svg>
              </div>

              <div className="absolute -top-4 -right-4 bg-[--color-lime-pulse] text-[--color-forest-depths] rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]">
                DS-01®
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[--color-warm-stone] bg-[--color-snow-white]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[--color-pewter]">
          <p>© 2026 Guardian Skincare Inc.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-[--color-forest-depths] transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
