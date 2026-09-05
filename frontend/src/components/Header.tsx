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
    <header className="w-full bg-[#fcfcf7] border-b border-[#eeeee9] sticky top-0 z-40">
      <div className="w-full px-6 md:px-12 h-[80px] flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start">
          <Link
            to="/"
            className="flex items-baseline gap-1.5 text-[28px] font-serif font-medium text-[#1c3a13] uppercase tracking-[0.1em] select-none whitespace-nowrap"
          >
            GUARDIAN
            <span className="w-2 h-2 rounded-full bg-[#d3fa99] mb-1"></span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-15 text-[16px] text-[#666666] font-medium tracking-wide whitespace-nowrap">
          <Link to="/products" className="hover:text-[#1c3a13] transition-colors">Sản phẩm</Link>
          <Link to="/rituals" className="hover:text-[#1c3a13] transition-colors">Chu trình</Link>
          <Link to="/community" className="hover:text-[#1c3a13] transition-colors">Cộng đồng</Link>
          <Link to="/about" className="hover:text-[#1c3a13] transition-colors">Về chúng tôi</Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-4">
          <Link 
            to="/login"
            className="hidden sm:flex items-center justify-center px-6 py-3 bg-[#fcfcf7] border-[1.5px] border-[#1c3a13] text-[#1c3a13] text-[16px] font-medium rounded-full hover:bg-zinc-50 transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link 
            to="/membership" 
            className="hidden sm:flex items-center justify-center px-6 py-3 bg-[#1c3a13] text-[#fcfcf7] text-[16px] font-medium rounded-full hover:bg-opacity-90 transition-colors whitespace-nowrap"
          >
            Become A Member
          </Link>
          
          <div className="flex items-center gap-2 ml-2">
            <button className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#d3fa99] rounded-full ring-2 ring-[#fcfcf7]"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors"
              title="Đăng xuất"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
