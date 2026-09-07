import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { productsService, type CategorySummary } from '../services/products.service';
import { ordersService, type BestSellerItem } from '../services/orders.service';

interface HeaderProps {
  roleTitle?: string;
  variant?: 'default' | 'auth';
}

interface CatalogProduct {
  code: string;
  name: string;
  imageUrl: string | null;
  variantName: string;
  categoryIds: string[];
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);
  const [catalog, setCatalog] = useState<Map<string, CatalogProduct>>(new Map());
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  const loadCatalog = useCallback(async () => {
    try {
      const cosmetics = await productsService.getCosmetics();

      const detailPromises = cosmetics.map((c) =>
        productsService.getCosmeticById(c.id).catch(() => null),
      );
      const details = await Promise.all(detailPromises);

      const map = new Map<string, CatalogProduct>();
      details.forEach((detail, idx) => {
        const summary = cosmetics[idx];
        if (!detail) return;
        for (const v of detail.variants) {
          map.set(v.id, {
            code: detail.code,
            name: detail.name,
            imageUrl: detail.imageUrl ?? summary.imageUrl,
            variantName: v.name,
            categoryIds: detail.categoryIds ?? [],
          });
        }
      });

      setCatalog(map);
    } catch (err) {
      console.error(err);
    } finally {
      setCatalogLoaded(true);
    }
  }, []);

  useEffect(() => {
    productsService.getCategories()
      .then((cats) => setCategories(cats.filter((c) => c.isActive)))
      .catch(console.error);

    loadCatalog();
    ordersService.getBestSellers(4).then(setBestSellers).catch(console.error);
  }, [loadCatalog]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isRegisterPage = location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  const bestSellerProducts = bestSellers
    .map((b) => {
      const p = catalog.get(b.variantId);
      if (!p) return null;
      return { ...p, variantId: b.variantId, quantitySold: b.quantitySold };
    })
    .filter((p): p is CatalogProduct & { variantId: string; quantitySold: number } => p !== null)
    .slice(0, 4);

  const fallbackProducts = !catalogLoaded
    ? []
    : bestSellerProducts.length >= 4
      ? []
      : Array.from(catalog.entries())
          .map(([variantId, p]) => ({ ...p, variantId, quantitySold: 0 }))
          .slice(0, Math.max(0, 4 - bestSellerProducts.length));

  const displayProducts =
    bestSellerProducts.length > 0 ? bestSellerProducts : fallbackProducts;

  const categoryCount = new Map<string, { name: string; count: number }>();
  for (const bp of bestSellerProducts) {
    for (const cid of bp.categoryIds) {
      const cat = categories.find((c) => c.id === cid);
      const existing = categoryCount.get(cid) ?? {
        name: cat?.name ?? 'Khác',
        count: 0,
      };
      existing.count += 1;
      categoryCount.set(cid, existing);
    }
  }

  const hotCategories = categoryCount.size > 0
    ? Array.from(categoryCount.entries())
        .sort((a, b) => b[1].count - a[1].count || a[1].name.localeCompare(b[1].name))
        .map(([id, v]) => ({ id, name: v.name }))
        .slice(0, 4)
    : categories.slice(0, 4);

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

        {/* Center: Search Area */}
        {!isAdminPage && (
          <div className="hidden lg:flex flex-[2] max-w-[700px] items-center justify-center gap-3">
            {/* Menu Box */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <div className={`flex items-center justify-center gap-1.5 p-2 rounded-lg cursor-pointer transition-colors ${isCategoryMenuOpen ? 'bg-[#eeeee9] text-[#1c3a13]' : 'hover:bg-[#eeeee9] text-[#666666]'}`}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                 </svg>
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Category Dropdown */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-[600px] bg-[#fcfcf7] border-[1.5px] border-[#1c3a13] rounded-[16px] overflow-hidden shadow-[0_12px_32px_rgba(28,58,19,0.08)] max-h-[70vh] flex flex-col">
                    <div className="px-6 py-4 border-b border-[#eeeee9] bg-[#fcfcf7] shrink-0">
                      <h3 className="text-[16px] font-medium text-[#1c3a13]">Tất cả danh mục</h3>
                    </div>
                    <div className="p-6 overflow-y-auto grid grid-cols-2 gap-x-8 gap-y-2">
                      {categories.length === 0 ? (
                        <div className="col-span-2 text-[14px] text-[#666666] py-2">
                          Chưa có danh mục
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-[14px] text-[#1c3a13] rounded-lg hover:bg-[#eeeee9] transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex flex-1 flex-col" ref={searchRef}>
              <div className={`relative flex items-center bg-[#fcfcf7] border-[1.5px] ${isSearchFocused ? 'border-[#1c3a13] rounded-t-[16px] rounded-b-none' : 'border-[#1c3a13] rounded-[8px]'} overflow-hidden h-[42px] transition-colors shadow-sm z-50`}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  onFocus={() => setIsSearchFocused(true)}
                  className="flex-1 h-full px-4 outline-none text-[14px] text-[#1c3a13] placeholder-[#666666] bg-transparent font-sans"
                />
                <button
                  onClick={() => {
                    setIsSearchFocused(true);
                    inputRef.current?.focus();
                  }}
                  className="h-full px-6 bg-[#1c3a13] hover:opacity-90 text-[#fcfcf7] transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Search Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 bg-[#fcfcf7] border-[1.5px] border-t-0 border-[#1c3a13] rounded-b-[16px] overflow-hidden shadow-[0_12px_32px_rgba(28,58,19,0.08)] z-40">
                  <div className="p-6 flex flex-col gap-6">
                    {/* Hot Keywords */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1c3a13]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="font-medium text-[16px]">Sản phẩm bán chạy</span>
                        </div>
                        <button className="text-[#666666] hover:text-[#1c3a13] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {displayProducts.length === 0 && (
                          <div className="col-span-2 text-[14px] text-[#666666] py-2">
                            Chưa có sản phẩm bán chạy
                          </div>
                        )}
                        {displayProducts.map((p) => (
                          <Link
                            key={p.variantId}
                            to={`/product/${p.code}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="w-12 h-12 bg-[#eeeee9] rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="w-full h-full flex items-center justify-center text-[14px] font-serif text-[#1c3a13] bg-[#e3ecd9] uppercase">
                                  {p.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <span className="text-[14px] text-[#666666] group-hover:text-[#1c3a13] transition-colors line-clamp-2">
                              {p.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#eeeee9]"></div>

                    {/* Hot Categories */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1c3a13]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span className="font-medium text-[16px]">Danh mục hot</span>
                        </div>
                        <button className="text-[#666666] hover:text-[#1c3a13] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {hotCategories.length === 0 && (
                          <div className="col-span-4 text-[14px] text-[#666666] py-2 text-center">
                            Chưa có danh mục
                          </div>
                        )}
                        {hotCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex flex-col items-center gap-2 cursor-pointer group"
                          >
                            <div className="w-16 h-16 rounded-full bg-[#e3ecd9] border border-transparent group-hover:border-[#1c3a13] flex items-center justify-center text-[22px] font-serif text-[#1c3a13] uppercase transition-colors overflow-hidden">
                              <span>{cat.name.charAt(0)}</span>
                            </div>
                            <span className="text-[12px] text-[#666666] group-hover:text-[#1c3a13] font-medium text-center transition-colors">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
            {!isAdminPage && (
              <button
                className="w-10 h-10 flex items-center justify-center text-[#1c3a13] hover:bg-[#eeeee9] rounded-full transition-colors relative"
                title="Giỏ hàng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#d3fa99] rounded-full ring-2 ring-[#fcfcf7]"></span>
              </button>
            )}

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
                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#1c3a13] hover:bg-[#eeeee9] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#757c5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Trang quản trị</span>
                      </Link>
                    )}
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

          <div className="hidden lg:flex items-center gap-1 border border-[#eeeee9] rounded-md px-1.5 py-1 cursor-pointer hover:bg-zinc-50 transition-colors">
            
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
