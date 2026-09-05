import { Link } from "react-router-dom";
import Header from "../../components/Header";

const LandingPage = () => {

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased flex flex-col">
      <Header roleTitle="Customer" />

      <main className="flex-1">
        {/* HERO — Snow White canvas, 50/50 split, whisper-light headline */}
        <section className="px-6 sm:px-12 pt-12 pb-24 sm:pt-16 sm:pb-32">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[--color-forest-depths] text-[10px] font-medium uppercase tracking-[0.18em] text-[--color-forest-depths]">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-lime-pulse]" />
                Bộ sưu tập mới — Xuân 2026
              </span>

              <h1
                className="mt-8 text-[--color-forest-depths] font-light leading-[1.05] tracking-[-0.02em]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(40px, 6vw, 64px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Da khỏe,
                <br />
                vẻ đẹp tự nhiên,
                <br />
                <span className="text-[--color-sage-moss]">
                  khoa học định hình.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-[16px] leading-[1.6] text-[--color-pewter]">
                Mỹ phẩm được bào chế theo phương pháp lâm sàng — với hệ vi sinh
                khỏe mạnh, thành phần minh bạch, và công thức whisper-light dành
                cho làn da nhạy cảm.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-[--color-forest-depths] text-[--color-snow-white] px-6 py-4 text-[14px] font-normal tracking-[0.02em] hover:opacity-90 transition-opacity"
                >
                  Khám phá sản phẩm →
                </Link>
                <a
                  href="#science"
                  className="inline-flex items-center gap-2 text-[14px] text-[--color-forest-depths] underline underline-offset-[6px] decoration-[1.5px] hover:opacity-70 transition-opacity"
                >
                  Câu chuyện khoa học
                </a>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
                <Stat label="Sản phẩm" value="24" />
                <Stat label="Thành phần hoạt tính" value="62" />
                <Stat label="Quốc gia" value="18" />
              </div>
            </div>

            {/* Right — botanical-clinical visual composition */}
            <div className="relative">
              <div
                className="aspect-[4/5] w-full rounded-[32px] overflow-hidden relative"
                style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(211,250,153,0.18), transparent 55%), radial-gradient(circle at 80% 75%, rgba(105,142,121,0.35), transparent 60%)",
                  }}
                />
                <svg
                  viewBox="0 0 400 500"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden
                >
                  {/* branching microbiome illustration */}
                  <g
                    fill="none"
                    stroke="#d3fa99"
                    strokeWidth="1.2"
                    opacity="0.55"
                  >
                    <path d="M200 460 Q 200 360 160 320 Q 120 280 110 220" />
                    <path d="M160 320 Q 140 300 130 260" />
                    <path d="M160 320 Q 200 300 230 270" />
                    <path d="M200 360 Q 240 340 270 300" />
                    <path d="M270 300 Q 300 280 320 250" />
                    <path d="M270 300 Q 280 260 260 220" />
                    <path d="M110 220 Q 90 200 95 170" />
                    <path d="M110 220 Q 130 200 145 180" />
                    <path d="M200 460 Q 220 420 215 380" />
                    <path d="M215 380 Q 235 350 230 320" />
                    <path d="M230 320 Q 260 310 280 290" />
                    <path d="M230 320 Q 210 300 195 280" />
                  </g>
                  <g fill="#d3fa99">
                    <circle cx="110" cy="220" r="3.5" />
                    <circle cx="160" cy="320" r="4" />
                    <circle cx="270" cy="300" r="3.5" />
                    <circle cx="200" cy="360" r="3" />
                    <circle cx="230" cy="320" r="3.5" />
                    <circle cx="215" cy="380" r="2.5" />
                    <circle cx="95" cy="170" r="2" />
                    <circle cx="130" cy="260" r="2" />
                    <circle cx="320" cy="250" r="2" />
                    <circle cx="260" cy="220" r="2" />
                  </g>
                </svg>
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-[--color-snow-white]">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-70">
                      Số danh mục
                    </p>
                    <p className="font-[var(--font-seed-sans-mono)] text-[14px] mt-1">
                      DS-01® / 24 SKU
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-70">
                      Phiên bản
                    </p>
                    <p className="font-[var(--font-seed-sans-mono)] text-[14px] mt-1">
                      v.2026.03
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[--color-lime-pulse] text-[--color-forest-depths] rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]">
                Mới
              </div>
            </div>
          </div>
        </section>

        {/* DARK SECTION — Product showcase on Forest Depths */}
        <section
          id="shop"
          className="w-full"
          style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
        >
          <div className="px-6 sm:px-12 py-24 sm:py-32 text-[--color-snow-white]">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] opacity-70">
                    Bộ sưu tập lõi
                  </p>
                  <h2
                    className="mt-4 leading-[1.1]"
                    style={{
                      fontWeight: 350,
                      fontSize: "clamp(32px, 4vw, 48px)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Bốn công thức.
                    <br />
                    Một hệ sinh học.
                  </h2>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-[14px] underline underline-offset-[6px] decoration-[1.5px] hover:opacity-70 transition-opacity"
                >
                  Xem tất cả sản phẩm →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.map((p) => (
                  <ProductCard key={p.code} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SCIENCE — Snow White canvas, 40/60 split */}
        <section
          id="science"
          className="px-6 sm:px-12 py-24 sm:py-32"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[--color-pewter]">
                Khoa học đằng sau
              </p>
              <h2
                className="mt-4 leading-[1.1] text-[--color-forest-depths]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Nuôi dưỡng hệ vi sinh
                <br />
                <span className="text-[--color-sage-moss]">
                  là gốc rễ của làn da khỏe.
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-[1.7] text-[--color-pewter] max-w-md">
                Mỗi công thức được phát triển cùng các bác sĩ da liễu và nhà vi
                sinh vật học, với bảng thành phần minh bạch — không hương liệu
                tổng hợp, không cồn khô, không paraben.
              </p>

              <div className="mt-10 space-y-5">
                <ScienceRow
                  title="Lớp bảo vệ tự nhiên"
                  desc="Prebiotics & postbiotics giúp củng cố hàng rào sinh học của da."
                />
                <ScienceRow
                  title="Thử nghiệm lâm sàng"
                  desc="Kiểm nghiệm độc lập trên 1.200+ tình nguyện viên, mọi loại da."
                />
                <ScienceRow
                  title="Bao bì khí hậu trung tính"
                  desc="Chai thủy tinh có thể tái chế, vận chuyển carbon-balanced."
                />
              </div>
            </div>

            {/* Right visual */}
            <div className="lg:col-span-7">
              <div className="relative grid grid-cols-2 gap-4">
                <div
                  className="aspect-square rounded-[32px] flex items-end p-6"
                  style={{ backgroundColor: "#d3fa99" }}
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-forest-depths]">
                      Bằng chứng
                    </p>
                    <p
                      className="mt-3 text-[--color-forest-depths]"
                      style={{
                        fontWeight: 350,
                        fontSize: "32px",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      94%
                    </p>
                    <p className="mt-2 text-[12px] text-[--color-forest-depths]/80 max-w-[180px]">
                      người dùng báo cáo da ẩm hơn sau 14 ngày
                    </p>
                  </div>
                </div>
                <div
                  className="aspect-square rounded-[32px] flex items-end p-6"
                  style={{ backgroundColor: "#eeeee9" }}
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-pewter]">
                      Thành phần
                    </p>
                    <p
                      className="mt-3 text-[--color-forest-depths]"
                      style={{
                        fontWeight: 350,
                        fontSize: "32px",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      62
                    </p>
                    <p className="mt-2 text-[12px] text-[--color-pewter] max-w-[180px]">
                      hoạt chất có nguồn gốc từ thực vật, được chuẩn hóa hàm
                      lượng
                    </p>
                  </div>
                </div>
                <div
                  className="aspect-square rounded-[32px] flex items-end p-6 col-span-2"
                  style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
                >
                  <div className="text-[--color-snow-white]">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-70">
                      Quy trình
                    </p>
                    <p
                      className="mt-3"
                      style={{
                        fontWeight: 350,
                        fontSize: "32px",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Ba bước · Sáng · Tối
                    </p>
                    <p className="mt-2 text-[12px] opacity-70 max-w-md">
                      Làm sạch nhẹ nhàng · Tinh chất định hướng · Kem dưỡng khóa
                      ẩm — đan vào nhau như một hệ sinh thái.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INGREDIENTS — Warm Stone alternating band */}
        <section
          className="px-6 sm:px-12 py-24 sm:py-32"
          style={{ backgroundColor: "#eeeee9" }}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
              <h2
                className="leading-[1.1] text-[--color-forest-depths] max-w-xl"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Thành phần được gọi tên.
                <br />
                <span className="text-[--color-sage-moss]">Không che giấu.</span>
              </h2>
              <p className="text-[14px] text-[--color-pewter] max-w-sm">
                Chúng tôi công bố đầy đủ hàm lượng hoạt chất trên mỗi nhãn —
                vì làn da bạn xứng đáng được tôn trọng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INGREDIENTS.map((ing) => (
                <div
                  key={ing.name}
                  className="rounded-[16px] p-6 flex flex-col gap-4 bg-[--color-snow-white]"
                  style={{ border: "1.5px solid rgba(28,58,19,0.06)" }}
                >
                  <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full border border-[--color-forest-depths] text-[10px] font-medium uppercase tracking-[0.18em] text-[--color-forest-depths]">
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
                  <p className="text-[14px] leading-[1.55] text-[--color-pewter]">
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

        {/* RITUAL — Dark section with editorial layout */}
        <section
          className="w-full"
          style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
        >
          <div className="px-6 sm:px-12 py-24 sm:py-32 text-[--color-snow-white]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="grid grid-cols-3 gap-3">
                  {RITUAL.map((step) => (
                    <div
                      key={step.code}
                      className="rounded-[16px] p-5 flex flex-col gap-3 h-full"
                      style={{ backgroundColor: "rgba(252,252,247,0.06)" }}
                    >
                      <span className="font-[var(--font-seed-sans-mono)] text-[12px] opacity-70">
                        {step.code}
                      </span>
                      <p
                        className="text-[--color-snow-white]"
                        style={{
                          fontWeight: 350,
                          fontSize: "20px",
                          lineHeight: 1.2,
                          letterSpacing: "-0.48px",
                        }}
                      >
                        {step.title}
                      </p>
                      <p className="text-[12px] opacity-70 leading-[1.55]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] opacity-70">
                  Nghi lễ hàng ngày
                </p>
                <h2
                  className="mt-4 leading-[1.1]"
                  style={{
                    fontWeight: 350,
                    fontSize: "clamp(32px, 4vw, 48px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Một nghi lễ yên tĩnh,
                  <br />
                  <span style={{ color: "#d3fa99" }}>
                    được khoa học hỗ trợ.
                  </span>
                </h2>
                <p className="mt-6 text-[16px] leading-[1.7] opacity-80 max-w-md">
                  Bắt đầu và kết thúc ngày với ba bước rõ ràng — được thiết kế
                  để tương thích với nhau và với hệ vi sinh trên da bạn.
                </p>
                <Link
                  to="/login"
                  className="mt-10 inline-flex items-center justify-center rounded-full border-[1.5px] border-[--color-snow-white] text-[--color-snow-white] px-6 py-4 text-[14px] hover:bg-[--color-snow-white] hover:text-[--color-forest-depths] transition-colors"
                >
                  Bắt đầu nghi lễ →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — Snow White */}
        <section
          className="px-6 sm:px-12 py-24 sm:py-32"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-xl mb-12">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[--color-pewter]">
                Nhật ký người dùng
              </p>
              <h2
                className="mt-4 leading-[1.1] text-[--color-forest-depths]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Ghi chép thật,
                <br />
                <span className="text-[--color-sage-moss]">
                  từ những làn da thật.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.author}
                  className="rounded-[16px] p-6 flex flex-col gap-6"
                  style={{
                    backgroundColor: "#eeeee9",
                  }}
                >
                  <blockquote
                    className="text-[--color-forest-depths]"
                    style={{
                      fontWeight: 350,
                      fontSize: "20px",
                      lineHeight: 1.3,
                      letterSpacing: "-0.48px",
                    }}
                  >
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-auto">
                    <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[--color-forest-depths]">
                      {t.author}
                    </p>
                    <p className="text-[12px] text-[--color-pewter] mt-1">
                      {t.meta}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          className="w-full"
          style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
        >
          <div className="px-6 sm:px-12 py-24 sm:py-32 text-center text-[--color-snow-white]">
            <div className="max-w-2xl mx-auto">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] opacity-70">
                Sẵn sàng bắt đầu
              </p>
              <h2
                className="mt-4 leading-[1.05]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(36px, 5vw, 56px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Da bạn xứng đáng
                <br />
                <span style={{ color: "#d3fa99" }}>sự minh bạch.</span>
              </h2>
              <p className="mt-6 text-[16px] opacity-80 max-w-md mx-auto">
                Đăng ký để nhận hướng dẫn chăm sóc da cá nhân hóa và quyền truy
                cập sớm vào bộ sưu tập mới.
              </p>

              <form
                className="mt-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  className="flex-1 bg-transparent border-[1.5px] border-[--color-snow-white] rounded-lg text-[--color-snow-white] placeholder:text-[--color-snow-white]/50 px-5 py-4 text-[14px] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full px-6 py-4 text-[14px] font-normal"
                  style={{
                    backgroundColor: "#fcfcf7",
                    color: "#1c3a13",
                  }}
                >
                  Tham gia
                </button>
              </form>

              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] opacity-60">
                Miễn phí · Hủy bất kỳ lúc nào
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="w-full border-t border-[--color-warm-stone]"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[--color-forest-depths]" />
                <span className="text-[18px] tracking-[0.18em] uppercase text-[--color-forest-depths]">
                  Guardian
                </span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.6] text-[--color-pewter] max-w-xs">
                Mỹ phẩm khoa học — được phát triển cho hệ vi sinh khỏe mạnh và
                hành tinh bền vững.
              </p>
              <p className="mt-8 font-[var(--font-seed-sans-mono)] text-[11px] text-[--color-pewter]">
                DS-01® · AM-02™ · DM-02™ · PM-02™
              </p>
            </div>

            <FooterCol
              title="Sản phẩm"
              items={["Sữa rửa mặt", "Tinh chất", "Kem dưỡng", "Bộ sưu tập"]}
            />
            <FooterCol
              title="Thương hiệu"
              items={["Câu chuyện", "Khoa học", "Bền vững", "Báo chí"]}
            />
            <FooterCol
              title="Hỗ trợ"
              items={["Liên hệ", "Vận chuyển", "Đổi trả", "Câu hỏi thường gặp"]}
            />
          </div>

          <div
            className="border-t border-[--color-warm-stone]"
            style={{ backgroundColor: "#fcfcf7" }}
          >
            <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[--color-pewter]">
              <p>© 2026 Guardian Skincare Inc.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-[--color-forest-depths]">
                  Điều khoản
                </a>
                <a href="#" className="hover:text-[--color-forest-depths]">
                  Bảo mật
                </a>
                <a href="#" className="hover:text-[--color-forest-depths]">
                  Cookie
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p
      className="text-[--color-forest-depths]"
      style={{
        fontWeight: 350,
        fontSize: "32px",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </p>
    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[--color-pewter]">
      {label}
    </p>
  </div>
);

const ScienceRow = ({ title, desc }: { title: string; desc: string }) => (
  <div className="border-t border-[--color-warm-stone] pt-5">
    <p
      className="text-[--color-forest-depths]"
      style={{ fontWeight: 400, fontSize: "16px" }}
    >
      {title}
    </p>
    <p className="mt-1 text-[14px] text-[--color-pewter] leading-[1.55]">
      {desc}
    </p>
  </div>
);

const FooterCol = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[--color-forest-depths]">
      {title}
    </p>
    <ul className="mt-4 space-y-2.5">
      {items.map((it) => (
        <li key={it}>
          <a
            href="#"
            className="text-[13px] text-[--color-pewter] hover:text-[--color-forest-depths] transition-colors"
          >
            {it}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

type Product = {
  code: string;
  name: string;
  price: string;
  accent: string;
};

const PRODUCTS: Product[] = [
  {
    code: "DS-01®",
    name: "Sữa rửa mặt vi sinh",
    price: "420.000₫",
    accent: "#1c3a13",
  },
  {
    code: "AM-02™",
    name: "Tinh chất sáng da ban ngày",
    price: "680.000₫",
    accent: "#9f995b",
  },
  {
    code: "DM-02™",
    name: "Huyết thanh cân bằng hằng ngày",
    price: "590.000₫",
    accent: "#757c5d",
  },
  {
    code: "PM-02™",
    name: "Kem phục hồi ban đêm",
    price: "720.000₫",
    accent: "#698e79",
  },
];

const ProductCard = ({ product }: { product: Product }) => (
  <article className="flex flex-col gap-5">
    <div
      className="aspect-[3/4] rounded-[16px] flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: product.accent }}
    >
      <span className="absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-full bg-[--color-snow-white]/20 text-[--color-snow-white] text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-[8px]">
        Mới
      </span>
      <div
        className="w-1/2 aspect-square rounded-full"
        style={{
          backgroundColor: "rgba(252,252,247,0.18)",
          backdropFilter: "blur(20px)",
        }}
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full border-[1.5px] border-[--color-snow-white] text-[10px] font-medium uppercase tracking-[0.2em] text-[--color-snow-white]">
        {product.code}
      </span>
      <h3
        className="text-[--color-snow-white]"
        style={{
          fontWeight: 350,
          fontSize: "24px",
          lineHeight: 1.15,
          letterSpacing: "-0.48px",
        }}
      >
        {product.name}
      </h3>
      <p className="font-[var(--font-seed-sans-mono)] text-[12px] font-medium uppercase tracking-[0.18em] text-[--color-snow-white]/70">
        {product.price}
      </p>
    </div>
    <Link
      to="/login"
      className="self-start inline-flex items-center justify-center rounded-full bg-[--color-snow-white] text-[--color-forest-depths] px-5 py-3 text-[14px] hover:opacity-90 transition-opacity"
    >
      Mua ngay →
    </Link>
  </article>
);

const INGREDIENTS = [
  {
    code: "ING-001",
    name: "Prebiotic Complex",
    desc: "Hỗn hợp prebiotic từ rễ cây bồ công anh và inulin, nuôi dưỡng vi khuẩn có lợi trên da.",
    spec: "5% w/w · pH 5.5 · Vegan",
  },
  {
    code: "ING-014",
    name: "Niacinamide 5%",
    desc: "Dạng vitamin B3 tinh khiết — làm đều tông da, giảm tiết dầu, củng cố hàng rào bảo vệ.",
    spec: "5% w/w · Mỹ phẩm · ISO 16128",
  },
  {
    code: "ING-027",
    name: "Centella Asiatica",
    desc: "Chiết xuất rau má tiêu chuẩn hóa, làm dịu và phục hồi làn da nhạy cảm.",
    spec: "Madecassoside 0.5% · COSMOS",
  },
];

const RITUAL = [
  {
    code: "01 / Sáng",
    title: "Làm sạch dịu nhẹ",
    desc: "Sữa rửa mặt vi sinh giữ độ ẩm tự nhiên cho da.",
  },
  {
    code: "02 / Sáng",
    title: "Tinh chất định hướng",
    desc: "Huyết thanh niacinamide cho một ngày rạng rỡ.",
  },
  {
    code: "03 / Tối",
    title: "Khóa ẩm phục hồi",
    desc: "Kem ban đêm với peptide nuôi dưỡng chuyên sâu.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Sau hai tuần, da tôi bớt đỏ hẳn — và tôi không còn sợ mỗi lần rửa mặt nữa.",
    author: "Linh P.",
    meta: "Da nhạy cảm · Hà Nội · Tuần 3",
  },
  {
    quote: "Thành phần được gọi tên rõ ràng — cuối cùng tôi cũng tin được một thương hiệu mỹ phẩm.",
    author: "Trang Đ.",
    meta: "Da dầu mụn · TP.HCM · Tuần 6",
  },
  {
    quote: "Một nghi lễ yên tĩnh thật sự. Bước nào rõ ràng, công dụng rõ ràng.",
    author: "Mai K.",
    meta: "Da khô · Đà Nẵng · Tuần 8",
  },
];

export default LandingPage;