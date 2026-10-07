import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  className?: string;
  hasTopBorder?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  className = "",
  hasTopBorder = true,
}) => {
  return (
    <footer
      className={`w-full ${hasTopBorder ? "border-t border-[--color-warm-stone]" : ""} ${className}`}
      style={{ backgroundColor: "#fcfcf7" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Cột 1: Thông tin thương hiệu Guardian */}
        <div className="md:col-span-4 flex flex-col justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <span className="w-2 h-2 rounded-full bg-[--color-forest-depths] group-hover:scale-125 transition-transform" />
              <span className="text-[18px] tracking-[0.18em] uppercase text-[--color-forest-depths] font-medium font-sans">
                Guardian
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-[1.65] text-[--color-pewter] max-w-sm">
              Mỹ phẩm khoa học — được phát triển cho hệ vi sinh khỏe mạnh và hành
              tinh bền vững.
            </p>
          </div>
        </div>

        {/* Cột 2: Sản phẩm */}
        <div className="md:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[--color-forest-depths]">
            Sản phẩm
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: "Sữa rửa mặt", to: "/shop" },
              { label: "Tinh chất", to: "/shop" },
              { label: "Kem dưỡng", to: "/shop" },
              { label: "Bộ sưu tập", to: "/shop" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[13px] text-[--color-pewter] hover:text-[--color-forest-depths] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Liên hệ (thay thế phần Thương hiệu và Hỗ trợ) */}
        <div className="md:col-span-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[--color-forest-depths]">
            Liên hệ
          </p>
          <div className="mt-4 space-y-2 text-[13px] leading-relaxed text-[--color-pewter]">
            <p className="font-semibold text-[--color-forest-depths] uppercase tracking-wide text-[12.5px] sm:text-[13px]">
              CÔNG TY TNHH MTV THƯƠNG MẠI VÀ ĐẦU TƯ GUARDIAN
            </p>
            <p className="text-[--color-pewter]">
              <span className="font-medium text-[--color-forest-depths]">
                Trụ sở chính:
              </span>{" "}
              CT1A, 211 Vĩnh Hưng, Ba Đình, Hà Nội
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <span>
                <span className="font-medium text-[--color-forest-depths]">
                  Hotline:
                </span>{" "}
                <a
                  href="tel:19003699"
                  className="text-[--color-forest-depths] hover:underline font-medium"
                >
                  19003699
                </a>
              </span>
              <span className="text-[--color-ash] hidden sm:inline">·</span>
              <span>
                <span className="font-medium text-[--color-forest-depths]">
                  Điện thoại:
                </span>{" "}
                <a
                  href="tel:0283283288"
                  className="text-[--color-forest-depths] hover:underline font-medium"
                >
                  0283283288
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền và chính sách */}
      <div
        className="border-t border-[--color-warm-stone]"
        style={{ backgroundColor: "#fcfcf7" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[--color-pewter]">
          <p>© 2026 Guardian Skincare Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[--color-forest-depths] transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-[--color-forest-depths] transition-colors">
              Bảo mật
            </a>
            <a href="#" className="hover:text-[--color-forest-depths] transition-colors">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
