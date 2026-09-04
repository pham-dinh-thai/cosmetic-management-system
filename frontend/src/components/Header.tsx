import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

interface HeaderProps {
  roleTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ roleTitle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="w-full border-b border-zinc-100 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors group"
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

        <Link
          to="/landing"
          className="text-2xl sm:text-3xl font-serif tracking-[0.25em] font-medium text-[#2C221E] uppercase select-none"
        >
          GUARDIAN
        </Link>

        <div className="flex items-center gap-4">
          {roleTitle && (
            <span className="hidden sm:inline text-xs uppercase tracking-wider text-zinc-400">
              {roleTitle}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#2C221E] border border-zinc-200 rounded-xl px-3.5 py-2 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
