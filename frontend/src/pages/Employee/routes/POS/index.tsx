import React from "react";
import { Card } from "../../../../components/ui/Primitives";
import { usePosPage, formatVND } from "./hook";
import type { CartItem } from "./type";

const PosPage: React.FC = () => {
  const s = usePosPage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#666666]">
            Bán hàng / POS
          </p>
          <h1
            className="mt-3 leading-[1.1]"
            style={{
              fontWeight: 350,
              fontSize: "clamp(32px, 4vw, 44px)",
              letterSpacing: "-0.02em",
            }}
          >
            Tạo đơn tại quầy.
          </h1>
          <p className="mt-3 text-[14px] text-[#666666]">
            Người thu ngân:{" "}
            <span className="font-medium text-[#1c3a13]">{s.cashierName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product catalog */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={s.search}
              onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm theo tên, mã, thương hiệu…"
              className="w-full h-12 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] pl-11 pr-4 text-[14px] text-[#1c3a13] placeholder:text-[#666666] focus:outline-none focus:border-[#1c3a13] transition-colors"
            />
          </div>

          {s.loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[16px] bg-[#eeeee9] h-[260px] animate-pulse"
                />
              ))}
            </div>
          ) : s.products.length === 0 ? (
            <Card className="text-center py-12 text-[14px] text-[#666666]">
              Không tìm thấy sản phẩm phù hợp.
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {s.products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => s.openProduct(p.id)}
                  className="text-left rounded-[16px] bg-[#fcfcf7] border border-[#eeeee9] hover:border-[#1c3a13] transition-colors overflow-hidden flex flex-col"
                >
                  <div className="aspect-square w-full bg-[#eeeee9] flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#666666]">
                        No image
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#666666]">
                      {p.code}
                    </span>
                    <span className="text-[14px] font-medium text-[#1c3a13] line-clamp-2">
                      {p.name}
                    </span>
                    <span className="mt-auto text-[12px] uppercase tracking-[0.12em] font-medium text-[#1c3a13] font-[var(--font-seed-sans-mono)]">
                      {p.variantCount} biến thể
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Customer + Cart */}
        <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Customer */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                Khách hàng
              </p>
              <button
                onClick={() => s.setShowAddCustomer((v) => !v)}
                className="text-[12px] uppercase tracking-[0.12em] font-medium text-[#1c3a13] hover:underline"
              >
                {s.showAddCustomer ? "Đóng" : "+ Thêm khách hàng"}
              </button>
            </div>

            {s.selectedCustomer ? (
              <div className="rounded-[12px] bg-[#eeeee9] p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-[#1c3a13]">
                    {s.selectedCustomer.name}
                  </span>
                  <span className="text-[12px] text-[#666666]">
                    {s.selectedCustomer.phone}
                  </span>
                </div>
                <button
                  onClick={s.clearCustomer}
                  className="text-[12px] text-[#666666] hover:text-[#1c3a13]"
                  aria-label="Bỏ chọn khách hàng"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  value={s.customerSearch}
                  onChange={(e) => {
                    s.setCustomerSearch(e.target.value);
                    s.setShowCustomerList(true);
                  }}
                  onFocus={() => s.setShowCustomerList(true)}
                  placeholder="Tìm khách hàng theo tên, SĐT…"
                  className="w-full h-10 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[14px] text-[#1c3a13] placeholder:text-[#666666] focus:outline-none focus:border-[#1c3a13] transition-colors"
                />
                {s.showCustomerList && s.customerSearch.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-[12px] bg-[#fcfcf7] border border-[#eeeee9] overflow-hidden">
                    {s.searchingCustomers ? (
                      <div className="p-3 text-[13px] text-[#666666]">
                        Đang tìm…
                      </div>
                    ) : s.customers.length === 0 ? (
                      <div className="p-3 text-[13px] text-[#666666]">
                        Không tìm thấy khách hàng.
                      </div>
                    ) : (
                      <ul className="max-h-64 overflow-y-auto">
                        {s.customers.map((c) => (
                          <li key={c.id}>
                            <button
                              onClick={() => {
                                s.setSelectedCustomer(c);
                                s.setShowCustomerList(false);
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-[#eeeee9] flex flex-col"
                            >
                              <span className="text-[14px] font-medium text-[#1c3a13]">
                                {c.name}
                              </span>
                              <span className="text-[12px] text-[#666666]">
                                {c.code} · {c.phone}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {s.showAddCustomer && (
              <div className="rounded-[12px] border border-[#eeeee9] p-3 flex flex-col gap-3">
                <input
                  value={s.newCustomer.name}
                  onChange={(e) =>
                    s.setNewCustomer((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Họ và tên *"
                  className="h-10 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[14px] focus:outline-none focus:border-[#1c3a13]"
                />
                <input
                  value={s.newCustomer.phone}
                  onChange={(e) =>
                    s.setNewCustomer((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Số điện thoại *"
                  className="h-10 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[14px] focus:outline-none focus:border-[#1c3a13]"
                />
                <input
                  value={s.newCustomer.email}
                  onChange={(e) =>
                    s.setNewCustomer((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="h-10 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[14px] focus:outline-none focus:border-[#1c3a13]"
                />
                <input
                  value={s.newCustomer.address}
                  onChange={(e) =>
                    s.setNewCustomer((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Địa chỉ"
                  className="h-10 rounded-[8px] border-[1.5px] border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[14px] focus:outline-none focus:border-[#1c3a13]"
                />
                <button
                  onClick={s.handleAddCustomer}
                  disabled={s.addingCustomer}
                  className="h-10 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[14px] font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                  {s.addingCustomer ? "Đang lưu…" : "Lưu khách hàng"}
                </button>
              </div>
            )}
          </Card>

          {/* Cart */}
          <CartPanel
            cart={s.cart}
            itemCount={s.itemCount}
            total={s.total}
            paymentMethod={s.paymentMethod}
            setPaymentMethod={s.setPaymentMethod}
            paymentOptions={s.paymentOptions}
            updateQty={s.updateQty}
            removeFromCart={s.removeFromCart}
            onCheckout={s.handleCheckout}
            checkingOut={s.checkingOut}
          />
        </div>
      </div>

      {/* Product detail modal */}
      {s.activeCosmetic && (
        <ProductModal
          cosmetic={s.activeCosmetic}
          onClose={s.closeProduct}
          onAdd={s.addToCart}
        />
      )}

      {s.loadingDetail && !s.activeCosmetic && (
        <div className="fixed inset-0 z-40 bg-[#1c3a13]/20 flex items-center justify-center text-[#fcfcf7] text-[14px]">
          Đang tải…
        </div>
      )}
    </div>
  );
};

interface CartPanelProps {
  cart: CartItem[];
  itemCount: number;
  total: number;
  paymentMethod: import("./type").PaymentMethod;
  setPaymentMethod: (m: import("./type").PaymentMethod) => void;
  paymentOptions: import("./type").PaymentOption[];
  updateQty: (variantId: string, qty: number) => void;
  removeFromCart: (variantId: string) => void;
  onCheckout: () => void;
  checkingOut: boolean;
}

const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  itemCount,
  total,
  paymentMethod,
  setPaymentMethod,
  paymentOptions,
  updateQty,
  removeFromCart,
  onCheckout,
  checkingOut,
}) => (
  <Card className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
        Giỏ hàng
      </p>
      <span className="text-[12px] uppercase tracking-[0.16em] font-medium text-[#1c3a13] font-[var(--font-seed-sans-mono)]">
        {itemCount} sản phẩm
      </span>
    </div>

    {cart.length === 0 ? (
      <div className="py-8 text-center text-[14px] text-[#666666]">
        Chưa có sản phẩm nào. Nhấp vào thẻ sản phẩm để thêm.
      </div>
    ) : (
      <ul className="flex flex-col divide-y divide-[#eeeee9]">
        {cart.map((item) => (
          <li key={item.variantId} className="py-3 flex gap-3 items-start">
            <div className="w-14 h-14 rounded-[8px] bg-[#eeeee9] flex items-center justify-center overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#666666]">
                  IMG
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#1c3a13] truncate">
                {item.productName}
              </p>
              <p className="text-[12px] text-[#666666] truncate">
                {item.variantName}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center border border-[#c4c7c4] rounded-full overflow-hidden">
                  <button
                    onClick={() => updateQty(item.variantId, item.quantity - 1)}
                    className="w-7 h-7 text-[#1c3a13] hover:bg-[#eeeee9]"
                    aria-label="Giảm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[13px] font-medium text-[#1c3a13] font-[var(--font-seed-sans-mono)]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.variantId, item.quantity + 1)}
                    className="w-7 h-7 text-[#1c3a13] hover:bg-[#eeeee9]"
                    aria-label="Tăng"
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px] font-medium text-[#1c3a13] font-[var(--font-seed-sans-mono)]">
                  {formatVND(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.variantId)}
              className="text-[12px] text-[#666666] hover:text-red-600"
              aria-label="Xóa"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    )}

    <div className="flex items-center justify-between pt-3 border-t border-[#eeeee9]">
      <span className="text-[12px] uppercase tracking-[0.16em] text-[#666666]">
        Tổng thanh toán
      </span>
      <span
        className="text-[#1c3a13] font-[var(--font-seed-sans-mono)]"
        style={{
          fontWeight: 350,
          fontSize: "28px",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {formatVND(total)}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {paymentOptions.map((opt) => {
        const active = paymentMethod === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setPaymentMethod(opt.value)}
            className={`h-10 rounded-full text-[13px] font-medium transition-colors border-[1.5px] ${
              active
                ? "bg-[#1c3a13] text-[#fcfcf7] border-[#1c3a13]"
                : "bg-transparent text-[#1c3a13] border-[#1c3a13] hover:bg-[#eeeee9]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>

    <button
      onClick={onCheckout}
      disabled={checkingOut || cart.length === 0}
      className="h-12 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[15px] font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
    >
      {checkingOut ? "Đang xử lý…" : "Thanh toán"}
    </button>
  </Card>
);

interface ProductModalProps {
  cosmetic: import("./type").CosmeticDetail;
  onClose: () => void;
  onAdd: (item: Omit<CartItem, "quantity">, qty: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  cosmetic,
  onClose,
  onAdd,
}) => (
  <div
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[24px] bg-[#fcfcf7] flex flex-col md:flex-row shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] hover:bg-[#1c3a13] hover:text-[#fcfcf7] transition-colors"
        aria-label="Đóng"
      >
        ✕
      </button>

      {/* Left: Image */}
      <div className="md:w-[45%] h-[240px] sm:h-[300px] md:h-auto bg-[#eeeee9] relative shrink-0">
        {cosmetic.imageUrl ? (
          <img
            src={cosmetic.imageUrl}
            alt={cosmetic.name}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center absolute inset-0">
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#666666]">
              Chưa có hình ảnh
            </span>
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="md:w-[55%] p-6 md:p-10 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col mb-8">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#666666] mb-3">
            {cosmetic.code}
          </span>
          <h3
            className="text-[#1c3a13]"
            style={{
              fontWeight: 350,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {cosmetic.name}
          </h3>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1c3a13]">
              Chọn biến thể
            </p>
            <span className="text-[12px] text-[#666666]">
              {cosmetic.variants.filter((v) => v.isActive).length} tuỳ chọn
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {cosmetic.variants
              .filter((v) => v.isActive)
              .map((v) => (
                <li
                  key={v.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-[16px] border border-[#eeeee9] bg-white p-4 hover:border-[#1c3a13]/30 transition-colors gap-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col">
                    <span className="text-[15px] font-medium text-[#1c3a13] mb-1">
                            {v.name}
                    </span>
                    <span className="text-[12px] text-[#666666]">
                      {[v.color, v.volume].filter(Boolean).join(" · ") || "Bản tiêu chuẩn"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[15px] font-medium text-[#1c3a13] font-[var(--font-seed-sans-mono)]">
                        {formatVND(v.price)}
                      </span>
                      {v.quantity !== undefined && v.quantity <= v.minStock && (
                        <span className="text-[11px] font-medium text-amber-600 mt-0.5">
                          Sản phẩm đã hết hàng
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        onAdd(
                          {
                            variantId: v.id,
                            cosmeticId: cosmetic.id,
                            productName: cosmetic.name,
                            variantName: v.name,
                            imageUrl: cosmetic.imageUrl,
                            unitPrice: v.price,
                            availableStock: v.quantity ?? 0,
                            minStock: v.minStock ?? 0,
                          },
                          1,
                        )
                      }
                      disabled={v.quantity !== undefined && v.quantity <= v.minStock}
                      className="h-9 px-5 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[13px] font-medium whitespace-nowrap shrink-0 hover:bg-[#2a501d] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {v.quantity !== undefined && v.quantity <= v.minStock
                        ? "Hết hàng"
                        : "Thêm vào đơn"}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default PosPage;