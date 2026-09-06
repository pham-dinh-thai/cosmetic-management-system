import { useState, type ReactNode } from "react";
import Header from "./Header";

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface DashboardLayoutProps {
  roleTitle: string;
  sidebarSections: SidebarSection[];
  sidebarTitle?: string;
  sidebarFooter?: ReactNode;
  children: ReactNode;
}

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 320;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  roleTitle,
  sidebarSections,
  sidebarTitle = "Bảng điều khiển",
  sidebarFooter,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#1c3a13] font-sans antialiased">
      <Header roleTitle={roleTitle} />

      <div className="flex w-full" style={{ minHeight: "calc(100vh - 80px)" }}>
        <aside
          className="sticky top-20 self-start flex flex-col border-r border-[#eeeee9] bg-[#fcfcf7] transition-[width] duration-300 ease-out"
          style={{
            width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            height: "calc(100vh - 80px)",
          }}
        >
          <div
            className={`flex items-center border-b border-[#eeeee9] px-4 ${
              collapsed ? "justify-center py-5" : "justify-between py-5"
            }`}
          >
            {!collapsed && (
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#666666] truncate">
                {sidebarTitle}
              </p>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
              aria-expanded={!collapsed}
              className="inline-flex items-center justify-center w-full max-w-[40px] h-9 rounded-full border border-[#1c3a13] text-[#1c3a13] hover:bg-[#1c3a13] hover:text-[#fcfcf7] transition-colors"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  collapsed ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 5l-7 7 7 7"
                />
              </svg>
            </button>
          </div>

          <nav
            className={`flex-1 overflow-y-auto ${
              collapsed ? "px-2 py-4" : "px-4 py-5"
            }`}
            aria-label="Dashboard sidebar"
          >
            <ul className="flex flex-col gap-6">
              {sidebarSections.map((section) => (
                <li key={section.id}>
                  {!collapsed && (
                    <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                      {section.title}
                    </p>
                  )}
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={item.onClick}
                          title={collapsed ? item.label : undefined}
                          className={`group flex w-full items-center gap-3 rounded-lg text-left transition-colors ${
                            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                          } ${
                            item.active
                              ? "bg-[#1c3a13] text-[#fcfcf7]"
                              : "text-[#1c3a13] hover:bg-[#eeeee9]"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center ${
                              item.active ? "text-[#fcfcf7]" : "text-[#1c3a13]/70"
                            }`}
                            aria-hidden
                          >
                            {item.icon ?? <DotIcon />}
                          </span>
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-[14px] leading-[1.4] truncate">
                                {item.label}
                              </span>
                              {item.badge !== undefined && (
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                                    item.active
                                      ? "bg-[#d3fa99] text-[#1c3a13]"
                                      : "bg-[#eeeee9] text-[#1c3a13]"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          {sidebarFooter && (
            <div
              className={`border-t border-[#eeeee9] ${
                collapsed ? "px-2 py-4" : "px-4 py-5"
              }`}
            >
              {sidebarFooter}
            </div>
          )}
        </aside>

        <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 py-10 sm:py-12 overflow-x-hidden">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

const DotIcon = () => (
  <svg
    className="w-2 h-2"
    fill="currentColor"
    viewBox="0 0 8 8"
    aria-hidden
  >
    <circle cx="4" cy="4" r="3" />
  </svg>
);

export default DashboardLayout;