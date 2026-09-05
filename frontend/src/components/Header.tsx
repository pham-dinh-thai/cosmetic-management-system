import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

interface HeaderProps {
  roleTitle?: string;
  variant?: 'default' | 'auth';
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isRegisterPage = location.pathname === '/register';

  if (variant === 'auth') {
    return (
      <header className="w-full bg-[#fcfcf7] border-b border-[#eeeee9] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 h-[80px] flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#666666] hover:text-[#1c3a13] transition-colors group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Về trang chủ</span>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="flex items-baseline gap-1.5 text-[26px] sm:text-[28px] font-serif font-medium text-[#1c3a13] uppercase tracking-[0.1em] select-none"
            >
              GUARDIAN
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end text-xs text-[#666666]">
            {isRegisterPage ? (
              <>
                <span className="hidden sm:inline">Đã có tài khoản?</span>
                <Link
                  to="/login"
                  className="ml-2 font-medium text-[#1c3a13] hover:underline uppercase tracking-wider text-[11px]"
                >
                  Đăng nhập
                </Link>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Chưa có tài khoản?</span>
                <Link
                  to="/register"
                  className="ml-2 font-medium text-[#1c3a13] hover:underline uppercase tracking-wider text-[11px]"
                >
                  Đăng ký ngay
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-[#fcfcf7] border-b border-[#eeeee9] sticky top-0 z-40">
      <div className="w-full px-6 md:px-12 h-[80px] flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start">
          <Link
            to="/"
            className="flex items-baseline gap-1.5 text-[28px] font-serif font-medium text-[#1c3a13] uppercase tracking-[0.1em] select-none whitespace-nowrap"
          >
            GUARDIAN
          </Link>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-10 xl:gap-14 text-[15px] text-[#666666] font-medium tracking-wide whitespace-nowrap">
          <Link to="/products" className="hover:text-[#1c3a13] transition-colors">
            Sản phẩm
          </Link>
          <Link to="/rituals" className="hover:text-[#1c3a13] transition-colors">
            Chu trình
          </Link>
          <Link to="/community" className="hover:text-[#1c3a13] transition-colors">
            Cộng đồng
          </Link>
          <Link to="/about" className="hover:text-[#1c3a13] transition-colors">
            Về chúng tôi
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-[#fcfcf7] border-[1.5px] border-[#1c3a13] text-[#1c3a13] text-[14px] font-medium rounded-full hover:bg-[#eeeee9] transition-all whitespace-nowrap"
              >
                Đăng nhập
              </Link>
              <Link
                to="/membership"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-[#1c3a13] text-[#fcfcf7] text-[14px] font-medium rounded-full hover:opacity-90 transition-all whitespace-nowrap"
              >
                Trở thành hội viên
              </Link>
            </>
          )}

          <div className="flex items-center gap-2 ml-2">
            <button
              className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors"
              title="Tìm kiếm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors relative"
              title="Giỏ hàng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#d3fa99] rounded-full ring-2 ring-[#fcfcf7]"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors"
                title={isAuthenticated ? "Tài khoản" : "Đăng nhập"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {isAuthenticated && isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-52 bg-[#fcfcf7] rounded-2xl border border-[#eeeee9] shadow-[0_12px_32px_rgba(28,58,19,0.08)] py-2 z-20 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#1c3a13] hover:bg-[#eeeee9] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#757c5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <div className="my-1 border-t border-[#eeeee9]" />
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50/80 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
