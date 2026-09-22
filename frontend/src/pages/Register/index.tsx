import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { customersService } from "../../services/customers.service";
import type { RegisterGender } from "../../services/auth.service";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<RegisterGender | "">("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setGender("");
      setAddress("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setAgreeTerms(false);
      setError(null);
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Vui lòng nhập đầy đủ họ và tên.");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại liên hệ.");
      return;
    }

    const phoneRegex = /^[0-9+() -]{9,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ (từ 9 đến 11 chữ số).");
      return;
    }

    if (!gender) {
      setError("Vui lòng chọn giới tính.");
      return;
    }

    if (!address.trim()) {
      setError("Vui lòng nhập địa chỉ liên hệ hoặc nhận hàng.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!agreeTerms) {
      setError("Vui lòng đồng ý với Điều khoản dịch vụ.");
      return;
    }

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender as RegisterGender,
        email: email.trim(),
        password,
        passwordConfirmation: confirmPassword,
      });

      // Save customer phone and address
      try {
        await customersService.ensureMe();
        await customersService.updateMe({
          user: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: gender as string,
          },
          phone: phone.trim(),
          address: address.trim(),
        });
      } catch (profileErr) {
        console.warn("Không thể lưu bổ sung số điện thoại/địa chỉ:", profileErr);
      }

      navigate("/", { replace: true });
    } catch (err) {
      const data = (err as { response?: { data?: { message?: unknown } } })
        ?.response?.data;
      const rawMessage = data?.message;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ")
        : typeof rawMessage === "string"
          ? rawMessage
          : undefined;
      setError(message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#1c3a13] font-sans antialiased flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#1c3a13] selection:text-[#fcfcf7]">
      {/* Main Split Container Card */}
      <div className="w-full max-w-[1120px] bg-white rounded-[32px] border border-[#eeeee9] overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        {/* Left Side: Botanical Visual Hero Section */}
        <div className="relative lg:w-[46%] min-h-[360px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden">
          {/* Background Cover Image */}
          <img
            src="/images/auth-cover.jpg"
            alt="Mỹ phẩm thiên nhiên Guardian"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Natural Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 pointer-events-none" />

          {/* Top Left Brand Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all text-xs tracking-wider uppercase font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-[#d3fa99]" />
              <span>GUARDIAN BEAUTY</span>
            </Link>
          </div>

          {/* Bottom Headline & Narrative */}
          <div className="relative z-10 mt-auto pt-16">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-light font-sans tracking-tight text-white leading-[1.18] mb-4">
              Gia Nhập Cùng Chúng Tôi, <br />
              Đồng Hành Phát Triển
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-md font-normal leading-relaxed">
              Trở thành thành viên của Guardian để tận hưởng các đặc quyền độc quyền,
              liệu trình chăm sóc da chuẩn khoa học và sản phẩm chính hãng.
            </p>
            <div className="mt-8 text-[11px] text-white/60 tracking-wider">
              © 2026 GUARDIAN. Bảo lưu mọi quyền.
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Auth Form */}
        <div className="lg:w-[54%] bg-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {/* Top Navigation Row: Back Link */}
          <div className="flex items-center justify-between mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#1c3a13] transition-colors group"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Về trang chủ</span>
            </Link>
          </div>

          <div className="my-auto py-1">
            <div className="mb-5">
              <h2 className="text-3xl font-normal tracking-tight text-[#1c3a13]">
                Đăng ký
              </h2>
              <p className="mt-1 text-sm text-[#666666]">
                Tạo tài khoản để tham gia hệ sinh thái Guardian.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 p-0.5"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Họ & tên đệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nguyễn Văn"
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Tên riêng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="An"
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Số điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Giới tính & Địa chỉ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as RegisterGender | "")
                    }
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] focus:outline-none focus:border-[#1c3a13] transition-all"
                  >
                    <option value="" disabled>
                      Chọn giới tính
                    </option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/quận..."
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Mật khẩu & Xác nhận mật khẩu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Mật khẩu (≥ 8 ký tự) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#666666] hover:text-[#1c3a13] transition-colors cursor-pointer"
                      aria-label={showPassword ? "Ẩn" : "Hiện"}
                    >
                      {showPassword ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                  >
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-[42px] px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#eeeee9] text-[#1c3a13] focus:ring-[#1c3a13] cursor-pointer"
                    required
                  />
                  <span className="text-xs text-[#666666] leading-tight">
                    Tôi đồng ý với{" "}
                    <a href="#" className="underline text-[#1c3a13] font-medium hover:text-black">
                      Điều khoản Dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="#" className="underline text-[#1c3a13] font-medium hover:text-black">
                      Chính sách Bảo mật
                    </a>{" "}
                    của Guardian.
                  </span>
                </label>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-6 rounded-full bg-[#1c3a13] hover:bg-[#162e0f] text-[#fcfcf7] text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <span>Tạo tài khoản</span>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-5 text-center text-xs text-[#666666]">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-[#1c3a13] underline hover:text-black ml-1"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>

          {/* Footer Legal Links */}
          <div className="pt-6 flex items-center justify-between text-[11px] text-[#666666] border-t border-[#eeeee9]">
            <a href="#" className="hover:text-[#1c3a13] transition-colors">
              Điều khoản Dịch vụ
            </a>
            <a href="#" className="hover:text-[#1c3a13] transition-colors">
              Chính sách Bảo mật
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
