import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import { getEmployeeLandingPath } from "../../lib/permissions";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, role, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storeUser = useAuthStore((s) => s.user);
  const returnTo = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (role === "admin" || role === "employee") {
      navigate(getEmployeeLandingPath(storeUser), { replace: true });
    } else if (role === "customer") {
      navigate(returnTo, { replace: true });
    }
  }, [role, navigate, storeUser, returnTo]);

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setRememberMe(false);
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch {
      // error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#1c3a13] font-sans antialiased flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#1c3a13] selection:text-[#fcfcf7]">
      {/* Main Split Container Card */}
      <div className="w-full max-w-[1080px] bg-white rounded-[32px] border border-[#eeeee9] overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        {/* Left Side: Botanical Visual Hero Section */}
        <div className="relative lg:w-[52%] min-h-[380px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden">
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
              Nâng Tầm Vẻ Đẹp, <br />
              Đồng Hành Cùng Tự Nhiên
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-md font-normal leading-relaxed">
              Khám phá hệ sinh thái mỹ phẩm và chăm sóc da chính hãng Guardian.
              Đồng hành cùng bạn trên hành trình chăm sóc làn da khoa học và thuần khiết.
            </p>
            <div className="mt-8 text-[11px] text-white/60 tracking-wider">
              © 2026 GUARDIAN. Bảo lưu mọi quyền.
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Auth Form */}
        <div className="lg:w-[48%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Navigation Row: Back Link */}
          <div className="flex items-center justify-between mb-8">
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

            <span className="text-xs text-[#666666] font-medium select-none">
              Tiếng Việt
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-2">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-3xl font-normal tracking-tight text-[#1c3a13]">
                Đăng nhập
              </h2>
              <p className="mt-1.5 text-sm text-[#666666]">
                Chào mừng bạn quay trở lại với Guardian.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
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
                  onClick={clearError}
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

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email / Username */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                >
                  Email hoặc Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email hoặc tên tài khoản"
                  required
                  className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#1c3a13] mb-1.5"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                    className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#eeeee9] text-sm text-[#1c3a13] placeholder:text-[#b3b3b3] focus:outline-none focus:border-[#1c3a13] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#1c3a13] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Options Row: Save ID Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#eeeee9] text-[#1c3a13] focus:ring-[#1c3a13] cursor-pointer"
                  />
                  <span className="text-xs text-[#666666]">Ghi nhớ đăng nhập</span>
                </label>

                <a
                  href="#"
                  className="text-xs text-[#666666] hover:text-[#1c3a13] underline transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Primary CTA Pill Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 px-6 rounded-full bg-[#1c3a13] hover:bg-[#162e0f] text-[#fcfcf7] text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 text-center text-xs text-[#666666]">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-medium text-[#1c3a13] underline hover:text-black ml-1"
              >
                Đăng ký ngay
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

export default Login;
