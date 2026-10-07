import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  fetchShopProducts,
  type ShopProduct,
} from "../../services/landing.service";

const LINE_1 = "Cảm nhận làn da tái sinh cùng";
const LINE_2 = "công nghệ chăm sóc thế hệ mới.";
const TOTAL_LENGTH = LINE_1.length + LINE_2.length;
const SCIENCE_HEADING = "Cân bằng hệ vi sinh. Đánh thức sức sống làn da.";

const LandingPage = () => {
  const [products, setProducts] = useState<ShopProduct[]>(PRODUCTS);
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isSplitLayout, setIsSplitLayout] = useState(false);
  const [showRemainingElements, setShowRemainingElements] = useState(false);

  const shopWrapperRef = useRef<HTMLDivElement>(null);
  const [zoomProgress, setZoomProgress] = useState(0);

  const scienceRef = useRef<HTMLElement>(null);
  const [isScienceInView, setIsScienceInView] = useState(false);
  const [scienceTypedText, setScienceTypedText] = useState("");
  const [isScienceTyping, setIsScienceTyping] = useState(false);
  const [isScienceComplete, setIsScienceComplete] = useState(false);

  const testimonialsRef = useRef<HTMLElement>(null);
  const [isTestimonialsInView, setIsTestimonialsInView] = useState(false);

  const guardianRef = useRef<HTMLElement>(null);
  const [guardianLift, setGuardianLift] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (shopWrapperRef.current) {
        const rect = shopWrapperRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const startY = windowHeight;
        const targetY = (windowHeight - rect.height) / 2;
        const totalDistance = startY - targetY;

        if (totalDistance > 0) {
          const currentDistance = startY - rect.top;
          const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
          setZoomProgress(progress);
        }
      }

      if (guardianRef.current) {
        const gRect = guardianRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const totalTravel = windowHeight + gRect.height;
        const currentPos = windowHeight - gRect.top;
        const progress = Math.min(Math.max(currentPos / totalTravel, 0), 1);

        const maxLift = Math.min(Math.max(window.innerWidth * 0.045, 24), 65);
        setGuardianLift(progress * maxLift);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsTestimonialsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    fetchShopProducts(PRODUCTS)
      .then((result) => {
        if (active) {
          setProducts(result);
        }
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    setLine1Text("");
    setLine2Text("");
    setIsTypingStarted(false);
    setIsSplitLayout(false);
    setShowRemainingElements(false);

    const startTimeout = setTimeout(() => {
      setIsTypingStarted(true);

      const interval = setInterval(() => {
        currentIndex++;

        if (currentIndex <= LINE_1.length) {
          setLine1Text(LINE_1.slice(0, currentIndex));
          setLine2Text("");
        } else {
          setLine1Text(LINE_1);
          const line2Index = currentIndex - LINE_1.length;
          setLine2Text(LINE_2.slice(0, line2Index));
        }

        if (currentIndex >= TOTAL_LENGTH) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSplitLayout(true);
            setTimeout(() => {
              setShowRemainingElements(true);
            }, 450);
          }, 650);
        }
      }, 35); 

      return () => clearInterval(interval);
    }, 350);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    const el = scienceRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsScienceInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isScienceInView) return;

    let index = 0;
    setIsScienceTyping(true);
    setScienceTypedText("");
    setIsScienceComplete(false);

    const interval = setInterval(() => {
      index++;
      setScienceTypedText(SCIENCE_HEADING.slice(0, index));

      if (index >= SCIENCE_HEADING.length) {
        clearInterval(interval);
        setIsScienceTyping(false);
        setIsScienceComplete(true);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isScienceInView]);

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased flex flex-col">
      <Header roleTitle="Customer" />

      <main className="flex-1">
        <section className="px-6 sm:px-12 lg:h-[calc(100vh-80px)] min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-[--color-snow-white]">
          <style>{`
            @keyframes hero-cursor-blink {
              0%, 45% { opacity: 1; }
              50%, 95% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
          <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-4 lg:py-6 relative">
            <div className="flex flex-col justify-center">
              <div
                className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${
                  isSplitLayout
                    ? "lg:translate-x-0 items-center lg:items-start text-center lg:text-left scale-100"
                    : "lg:translate-x-[calc(50%+2rem)] items-center text-center scale-[1.12]"
                }`}
              >
                <h1
                  className="text-[--color-forest-depths] font-light leading-[1.22] tracking-[-0.02em] transition-all duration-[1500ms]"
                  style={{
                    fontWeight: 350,
                    fontSize: isSplitLayout
                      ? "clamp(24px, 2.8vw, 38px)"
                      : "clamp(28px, 3.6vw, 44px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span className="block whitespace-nowrap">
                    {line1Text}
                    {isTypingStarted && line2Text.length === 0 && (
                      <span
                        className="inline-block font-light ml-0.5 text-[--color-forest-depths] select-none align-baseline"
                        style={{
                          animation: "hero-cursor-blink 0.9s infinite",
                        }}
                        aria-hidden="true"
                      >
                        |
                      </span>
                    )}
                  </span>
                  <span className="block whitespace-nowrap mt-1 min-h-[1.22em]">
                    {line2Text}
                    {line2Text.length > 0 && (
                      <span
                        className="inline-block font-light ml-0.5 text-[--color-forest-depths] select-none align-baseline"
                        style={{
                          animation: "hero-cursor-blink 0.9s infinite",
                        }}
                        aria-hidden="true"
                      >
                        |
                      </span>
                    )}
                  </span>
                </h1>
              </div>

              <div
                className={`transition-all duration-[1000ms] ease-out ${
                  showRemainingElements
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <p className="mt-6 max-w-md text-[15px] sm:text-[16px] leading-[1.65] text-[--color-pewter] text-center lg:text-left mx-auto lg:mx-0">
                  Chắt lọc tinh túy thực vật qua lăng kính khoa học — cân bằng
                  hệ vi sinh với bảng thành phần minh bạch, nhẹ êm như không cho
                  làn da nhạy cảm.
                </p>

                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/shop"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1c3a13] hover:bg-[#162e0f] text-[#fcfcf7] px-7 py-3.5 text-[14px] sm:text-[15px] font-medium tracking-[0.02em] shadow-[0_2px_8px_rgba(28,58,19,0.12)] hover:shadow-[0_4px_16px_rgba(28,58,19,0.18)] active:scale-[0.98] transition-all duration-200"
                  >
                    <span>Khám phá sản phẩm</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="mt-12 sm:mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  <Stat label="Sản phẩm" value="99+" />
                  <Stat label="Thành phần hoạt tính" value="62" />
                  <Stat label="Quốc gia" value="108" />
                </div>
              </div>
            </div>

            <div
              className={`relative transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isSplitLayout
                  ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 scale-[0.2] -translate-x-12 pointer-events-none"
              }`}
              style={{ transformOrigin: "left center" }}
            >
              <div
                className="aspect-[4/5] h-[420px] sm:h-[480px] lg:h-[520px] w-auto mx-auto lg:ml-auto lg:mr-0 rounded-[32px] overflow-hidden relative shadow-none"
                style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(211,250,153,0.18), transparent 55%), radial-gradient(circle at 80% 75%, rgba(105,142,121,0.35), transparent 60%)",
                  }}
                />
                <img
                  src="/images/auth-cover.jpg"
                  alt="Mỹ phẩm thiên nhiên Guardian"
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(28,58,19,0.1), rgba(28,58,19,0.35))",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div
          ref={shopWrapperRef}
          className="w-full mt-16 sm:mt-24 lg:mt-32 min-h-[calc(100vh+60px)] lg:min-h-[calc(100vh+80px)] relative flex items-center justify-center"
        >
          <section
            id="shop"
            className="w-full min-h-[calc(100vh+60px)] lg:min-h-[calc(100vh+80px)] flex flex-col justify-center items-center transition-all duration-300 ease-out origin-center"
            style={{
              backgroundColor: "#1c3a13",
              color: "#fcfcf7",
              transform: `scale(${0.35 + 0.65 * zoomProgress})`,
              borderRadius: `${(1 - zoomProgress) * 44}px`,
              boxShadow:
                zoomProgress < 0.98
                  ? "0 35px 90px -20px rgba(0, 0, 0, 0.45)"
                  : "none",
            }}
          >
            <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-28 sm:pb-32 lg:pb-36 xl:pb-40 text-[--color-snow-white]">
              <div className="relative z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10 lg:mb-12 xl:mb-14">
                <div>
                  <p className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.24em] opacity-80 text-[#d3fa99]">
                    Bộ sưu tập
                  </p>
                  <h2
                    className="mt-1.5 leading-[1.12]"
                    style={{
                      fontWeight: 350,
                      fontSize: "clamp(26px, 3.2vw, 42px)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Bốn công thức.
                    <br className="hidden sm:inline" /> Một hệ sinh học.
                  </h2>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[--color-snow-white] hover:text-[#d3fa99] underline underline-offset-[6px] decoration-[1.5px] transition-colors mb-1 sm:mb-2"
                >
                  <span>Xem tất cả sản phẩm</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
                {products.map((p, index) => (
                  <ProductCard key={p.code} product={p} index={index} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <section
          id="partners"
          className="w-full py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-white border-t border-b border-black/[0.06]"
        >
          <div className="text-center max-w-2xl mx-auto px-6 mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1c3a13]/[0.06] text-[#1c3a13] text-[11px] font-semibold uppercase tracking-[0.24em]">
              Thương hiệu hợp tác
            </span>
            <h3
              className="mt-3 text-[--color-forest-depths]"
              style={{
                fontWeight: 350,
                fontSize: "clamp(24px, 2.8vw, 36px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Hội tụ các biểu tượng sắc đẹp hàng đầu
            </h3>
            <p className="mt-2.5 text-[14px] sm:text-[15px] text-[--color-pewter] max-w-lg mx-auto">
              Guardian tự hào phân phối chính hãng 100% từ các tập đoàn dược mỹ
              phẩm và thời trang danh tiếng toàn cầu.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-10 sm:py-14">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 z-20"
              style={{
                background:
                  "linear-gradient(to right, #ffffff 25%, rgba(255,255,255,0) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 z-20"
              style={{
                background:
                  "linear-gradient(to left, #ffffff 25%, rgba(255,255,255,0) 100%)",
              }}
            />

            <div className="flex animate-brand-marquee group w-max items-center">
              {[...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS].map(
                (brand, idx) => (
                  <div
                    key={`${brand.name}-${idx}`}
                    className="flex-shrink-0 px-7 sm:px-10 lg:px-14 brand-sine-wave flex items-center justify-center"
                    style={{
                      animationDelay: `${(idx % 10) * -0.42}s`,
                    }}
                  >
                    <div
                      className="group/logo flex items-center justify-center transition-transform duration-300 hover:scale-120 cursor-pointer"
                      title={brand.name}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.alt}
                        className={`h-13 sm:h-16 lg:h-20 max-w-[190px] sm:max-w-[240px] lg:max-w-[280px] w-auto object-contain select-none opacity-80 hover:opacity-100 transition-all duration-300 ${
                          brand.customClass ?? ""
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="science"
          ref={scienceRef}
          className="px-6 sm:px-12 py-24 sm:py-32 overflow-hidden"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.24em] text-[--color-pewter] transition-opacity duration-700 ${
                  isScienceInView ? "opacity-100" : "opacity-0"
                }`}
              >
                Được kiểm chứng bởi chuyên gia khoa học
              </p>
              <h2
                className="mt-4 leading-[1.1] text-[--color-forest-depths] min-h-[2.2em]"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                }}
              >
                {scienceTypedText}
                {isScienceTyping && !isScienceComplete && (
                  <span
                    className="inline-block font-light ml-0.5 text-[--color-forest-depths] select-none align-baseline"
                    style={{
                      animation: "hero-cursor-blink 0.9s infinite",
                    }}
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </h2>
              <p
                className={`mt-6 text-[16px] leading-[1.7] text-[--color-pewter] max-w-md transition-all duration-700 ease-out ${
                  isScienceComplete
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                Đồng nghiên cứu bởi chuyên gia da liễu và các nhà vi sinh học.
                Minh bạch tuyệt đối, loại bỏ cồn xấu, paraben và hương liệu tổng
                hợp.
              </p>

              <div className="mt-10 space-y-5">
                <ScienceRow
                  title="Hàng rào sinh học"
                  desc="Nuôi dưỡng hệ vi sinh khỏe mạnh với phức hợp Prebiotic & Postbiotic."
                  className={`transition-all duration-700 ease-out ${
                    isScienceComplete
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-12"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                />
                <ScienceRow
                  title="Thử nghiệm lâm sàng"
                  desc="Hiệu quả được chứng thực qua 1.200+ thử nghiệm trên đa dạng nền da."
                  className={`transition-all duration-700 ease-out ${
                    isScienceComplete
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-12"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                />
                <ScienceRow
                  title="Cam kết vì hành tinh"
                  desc="Chai thủy tinh tái sinh 100%, bù trừ carbon trên mọi dặm đường."
                  className={`transition-all duration-700 ease-out ${
                    isScienceComplete
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-12"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative grid grid-cols-2 gap-4">
                <div
                  className="relative aspect-square rounded-[32px] overflow-hidden flex items-end p-6 group shadow-lg"
                  style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
                >
                  <img
                    src="/images/hydration-evidence.png"
                    alt="Hiệu quả cấp ẩm 94%"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,58,19,0.95) 0%, rgba(28,58,19,0.65) 50%, rgba(0,0,0,0.1) 85%)",
                    }}
                  />
                  <div className="relative z-10 w-full text-[--color-snow-white]">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-snow-white]">
                        Bằng chứng
                      </span>
                    </div>
                    <p
                      className="mt-1 text-[--color-snow-white]"
                      style={{
                        fontWeight: 350,
                        fontSize: "clamp(20px, 2.3vw, 28px)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      94% da ẩm mượt sau 14 ngày
                    </p>
                    <p className="mt-2 text-[13px] sm:text-[14px] text-[--color-snow-white]/85 leading-relaxed">
                      Người dùng báo cáo phục hồi độ ẩm tự nhiên rõ rệt
                    </p>
                  </div>
                </div>

                <div
                  className="relative aspect-square rounded-[32px] overflow-hidden flex items-end p-6 group shadow-lg"
                  style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
                >
                  <img
                    src="/images/aloe-ingredient.jpg"
                    alt="Thành phần thực vật chuẩn hóa"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,58,19,0.95) 0%, rgba(28,58,19,0.65) 50%, rgba(0,0,0,0.1) 85%)",
                    }}
                  />
                  <div className="relative z-10 w-full text-[--color-snow-white]">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-snow-white]">
                        Thành phần
                      </span>
                    </div>
                    <p
                      className="mt-1 text-[--color-snow-white]"
                      style={{
                        fontWeight: 350,
                        fontSize: "clamp(20px, 2.3vw, 28px)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      62 hoạt chất sinh học tự nhiên
                    </p>
                    <p className="mt-2 text-[13px] sm:text-[14px] text-[--color-snow-white]/85 leading-relaxed">
                      Nha đam và thực vật chuẩn hóa hàm lượng y khoa
                    </p>
                  </div>
                </div>
                <div
                  className="relative col-span-2 rounded-[32px] overflow-hidden min-h-[280px] sm:min-h-[340px] aspect-[16/10] flex items-end p-6 sm:p-8 group shadow-lg"
                  style={{ backgroundColor: "#1c3a13", color: "#fcfcf7" }}
                >
                  <img
                    src="/images/skincare-routine.jpg"
                    alt="Quy trình chăm sóc da 3 bước sáng tối"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,58,19,0.92) 0%, rgba(28,58,19,0.55) 45%, rgba(0,0,0,0.15) 85%)",
                    }}
                  />
                  <div className="relative z-10 w-full text-[--color-snow-white]">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-snow-white]">
                        Quy trình
                      </span>
                    </div>
                    <p
                      className="mt-1"
                      style={{
                        fontWeight: 350,
                        fontSize: "clamp(24px, 2.5vw, 32px)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Ba bước tối giản cho làn da khỏe mạnh
                    </p>
                    <p className="mt-2 text-[13px] sm:text-[14px] text-[--color-snow-white]/85 max-w-lg leading-relaxed">
                      Làm sạch nhẹ nhàng · Tinh chất phục hồi tái sinh · Kem
                      dưỡng khóa ẩm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        {/* TESTIMONIALS — Snow White */}
        <section
          ref={testimonialsRef}
          className="px-6 sm:px-12 py-24 sm:py-32 overflow-hidden"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-xl mb-12">
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.24em] text-[--color-pewter] transition-opacity duration-700 ${
                  isTestimonialsInView ? "opacity-100" : "opacity-0"
                }`}
              >
                Nhật ký người dùng
              </p>
              <h2
                className={`mt-4 leading-[1.1] text-[--color-forest-depths] transition-all duration-700 ease-out ${
                  isTestimonialsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-6"
                }`}
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
              {TESTIMONIALS.map((t, idx) => {
                const isFromTop = idx % 2 === 0;
                const initialTranslate = isFromTop
                  ? "-translate-y-16"
                  : "translate-y-16";
                const delay = `${idx * 200 + 150}ms`;

                return (
                  <figure
                    key={t.author}
                    className={`rounded-[16px] p-6 flex flex-col gap-6 transition-all duration-800 ease-out ${
                      isTestimonialsInView
                        ? "opacity-100 translate-y-0"
                        : `opacity-0 ${initialTranslate}`
                    }`}
                    style={{
                      backgroundColor: "#eeeee9",
                      transitionDelay: delay,
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
                );
              })}
            </div>
          </div>
        </section>

        {/* GUARDIAN BRAND DISPLAY SECTION */}
        <section
          ref={guardianRef}
          className="w-full min-h-[50vh] sm:min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden py-24 sm:py-36 select-none"
          style={{ backgroundColor: "#fcfcf7" }}
        >
          <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 text-center flex flex-col items-center justify-center">
            <div
              className="flex items-baseline justify-center text-black leading-none font-bold uppercase select-none"
              style={{
                fontFamily: "var(--font-seed-sans)",
                fontWeight: 700,
                fontSize: "clamp(52px, 14vw, 220px)",
                letterSpacing: "-0.02em",
                color: "#000000",
              }}
            >
              <span className="inline-block">GUARDI</span>
              <span
                className="inline-block will-change-transform"
                style={{
                  transform: `translateY(-${guardianLift}px)`,
                }}
              >
                AN
              </span>
            </div>
          </div>
        </section>

        <Footer hasTopBorder={false} />
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

const ScienceRow = ({
  title,
  desc,
  className = "",
  style,
}: {
  title: string;
  desc: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`border-t border-[--color-warm-stone] pt-5 ${className}`}
    style={style}
  >
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


const PRODUCTS: ShopProduct[] = [
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

interface BrandPartner {
  name: string;
  logo: string;
  alt: string;
  customClass?: string;
}

const BRAND_PARTNERS: BrandPartner[] = [
  { name: "Dior", logo: "/brands/ideYgQUHAY_1791364561796.svg", alt: "Dior" },
  { name: "Chanel", logo: "/brands/Symbol.svg", alt: "Chanel" },
  {
    name: "Yves Saint Laurent",
    logo: "/brands/yves-saint-laurent-1.svg",
    alt: "Yves Saint Laurent",
  },
  { name: "Gucci", logo: "/brands/Logo.svg", alt: "Gucci" },
  {
    name: "La Roche-Posay",
    logo: "/brands/La_Roche_ide6aM5qWb_0.svg",
    alt: "La Roche-Posay",
  },
  { name: "CeraVe", logo: "/brands/CeraVe_idRMvstMwe_0.svg", alt: "CeraVe" },
  {
    name: "Paula's Choice",
    logo: "/brands/idGAguSOOH_1791364334568.svg",
    alt: "Paula's Choice",
  },
  {
    name: "The Ordinary",
    logo: "/brands/idpxGYNMtA_logos.svg",
    alt: "The Ordinary",
  },
  {
    name: "Bioderma",
    logo: "/brands/BIODERMA_idbLzc_RKB_0.svg",
    alt: "Bioderma",
  },
  {
    name: "3CE Stylenanda",
    logo: "/brands/idG3Cm4CYM_logos.svg",
    alt: "3CE Stylenanda",
  },
  { name: "Rom&nd", logo: "/brands/Romnd-Logo-SVG_001.svg", alt: "Rom&nd" },
  {
    name: "Obagi Medical",
    logo: "/brands/idLW9FEAZq_logos.jpeg",
    alt: "Obagi Medical",
    customClass: "mix-blend-multiply",
  },
  {
    name: "Judydoll",
    logo: "/brands/idbIbmQMI3_logos.png",
    alt: "Judydoll",
    customClass: "brightness-0",
  },
];

const ProductCard = ({
  product,
  index,
}: {
  product: ShopProduct;
  index: number;
}) => {
  const isShiftedDown = index % 2 === 1;
  const productDetailUrl = `/product/${encodeURIComponent(product.code)}`;

  return (
    <article
      className={`flex flex-col gap-3 transition-transform duration-300 ${
        isShiftedDown
          ? "lg:translate-y-4 xl:translate-y-5"
          : "lg:-translate-y-4 xl:-translate-y-5"
      }`}
    >
      <Link
        to={productDetailUrl}
        className="group/img block aspect-[4/5] max-h-[320px] sm:max-h-[360px] lg:max-h-[370px] xl:max-h-[420px] w-full rounded-[22px] relative overflow-hidden transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_16px_36px_rgba(0,0,0,0.38)] cursor-pointer border border-white/15"
        style={{
          backgroundColor:
            product.accent === "#1c3a13" ? "#224419" : product.accent,
        }}
        title={`Xem chi tiết ${product.name}`}
      >
        <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[--color-snow-white]/25 text-[--color-snow-white] text-[9.5px] font-medium uppercase tracking-[0.18em] backdrop-blur-[8px]">
          Mới
        </span>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-transform duration-500 group-hover/img:scale-110 shadow-lg"
              style={{
                backgroundColor: "rgba(252,252,247,0.2)",
                backdropFilter: "blur(20px)",
              }}
            />
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full border border-[--color-snow-white]/50 text-[9px] font-medium uppercase tracking-[0.2em] text-[--color-snow-white]/90">
          {product.code}
        </span>
        <Link
          to={productDetailUrl}
          className="group/title block focus:outline-none"
        >
          <h3
            className="text-[--color-snow-white] group-hover/title:text-[#d3fa99] transition-colors duration-200 line-clamp-1"
            style={{
              fontWeight: 350,
              fontSize: "17.5px",
              lineHeight: 1.3,
              letterSpacing: "-0.2px",
            }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="font-[var(--font-seed-sans-mono)] text-[12.5px] font-medium uppercase tracking-[0.16em] text-[--color-snow-white]/80">
          {product.price}
        </p>
      </div>
      <Link
        to={productDetailUrl}
        className="group/btn self-start inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fcfcf7] hover:bg-[#d3fa99] text-[#1c3a13] px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] shadow-[0_4px_14px_rgba(0,0,0,0.22)] hover:shadow-[0_4px_20px_rgba(211,250,153,0.45)] border border-white/50 hover:border-[#d3fa99] active:scale-[0.96] transition-all duration-200 cursor-pointer"
      >
        <span>Mua ngay</span>
        <span className="transition-transform duration-200 group-hover/btn:translate-x-1 font-bold">
          →
        </span>
      </Link>
    </article>
  );
};



const TESTIMONIALS = [
  {
    quote:
      "Sau hai tuần, da tôi bớt đỏ hẳn và tôi không còn sợ mỗi lần rửa mặt nữa.",
    author: "Phạm Thị Linh",
    meta: "Da nhạy cảm · Hà Nội · Tuần 3",
  },
  {
    quote:
      "Bảng thành phần lành tính, không mùi cồn hay hương liệu nồng. Cảm giác da được 'thở' mà vẫn căng mọng cả ngày dài.",
    author: "Trần Thị Quỳnh Anh",
    meta: "Da dầu mụn · TP.HCM · Tuần 6",
  },
  {
    quote:
      "Chất kem mỏng nhẹ tênh như không thoa gì, thấm nhanh mà không hề bết rít hay châm chích. Da mình cực kỳ nhạy cảm nhưng dùng trộm vía rất êm, nền da khỏe và mướt mịn rõ rệt sau 2 tuần.",
    author: "Nguyễn Thị Thu Mai",
    meta: "Da khô · Đà Nẵng · Tuần 8",
  },
];

export default LandingPage;