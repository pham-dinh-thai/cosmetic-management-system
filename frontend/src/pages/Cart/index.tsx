import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  useCartStore,
  formatVND,
  cartSubtotal,
} from "../../store/useCartStore";
import { toast } from "sonner";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = cartSubtotal(items);

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col">
      <Header roleTitle="Customer" />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-12 py-12 sm:py-20">
        <h1 
          className="text-forest-depths mb-12"
          style={{
            fontWeight: 350,
            fontSize: "clamp(32px, 4vw, 48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          Giỏ hàng của bạn.
        </h1>

        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <p className="text-[18px] text-pewter mb-8">
              Giỏ hàng của bạn đang trống.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 border-b border-warm-stone first:pt-0">
                  <Link to={`/product/${encodeURIComponent(item.productCode)}`} className="shrink-0">
                    <div 
                      className="w-24 h-32 sm:w-32 sm:h-40 rounded-[12px] flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105"
                      style={{ backgroundColor: item.accent || "#1c3a13" }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-1/2 aspect-square rounded-full"
                          style={{
                            backgroundColor: "rgba(252,252,247,0.12)",
                            backdropFilter: "blur(8px)",
                          }}
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link to={`/product/${encodeURIComponent(item.productCode)}`}>
                          <h3 className="text-[18px] text-forest-depths hover:opacity-80 transition-opacity" style={{ fontWeight: 400 }}>
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success("Đã xóa khỏi giỏ hàng.");
                          }}
                          className="text-[12px] font-medium uppercase tracking-[0.1em] text-pewter hover:text-forest-depths transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                      <span className="inline-block mt-2 font-[var(--font-seed-sans-mono)] text-[10px] font-medium uppercase tracking-[0.15em] text-pewter">
                        {item.productCode} — {item.variantName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border-[1.5px] border-forest-depths rounded-full overflow-hidden">
                        <button
                          onClick={() => decrement(item.id)}
                          className="px-3 py-1 text-forest-depths hover:bg-warm-stone transition-colors font-[var(--font-seed-sans-mono)]"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-[14px] font-[var(--font-seed-sans-mono)] text-forest-depths border-l-[1.5px] border-r-[1.5px] border-forest-depths">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="px-3 py-1 text-forest-depths hover:bg-warm-stone transition-colors font-[var(--font-seed-sans-mono)]"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="font-[var(--font-seed-sans-mono)] text-[16px] font-medium text-forest-depths">
                        {formatVND(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 bg-warm-stone rounded-[16px] p-8 sticky top-24">
              <h2 className="text-[24px] text-forest-depths mb-6" style={{ fontWeight: 350 }}>
                Tóm tắt đơn hàng.
              </h2>

              <div className="flex flex-col gap-4 text-[16px] text-forest-depths border-b border-pewter/20 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-pewter">Tạm tính</span>
                  <span className="font-[var(--font-seed-sans-mono)] font-medium">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pewter">Giao hàng</span>
                  <span className="font-[var(--font-seed-sans-mono)] font-medium">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-[18px] font-medium">Tổng cộng</span>
                <span className="font-[var(--font-seed-sans-mono)] text-[24px] font-medium text-forest-depths">{formatVND(subtotal)}</span>
              </div>

              <Link 
                to="/checkout"
                className="w-full inline-flex items-center justify-center rounded-full bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
              >
                Tiến hành thanh toán
              </Link>

              <div className="mt-6 text-center">
                <Link to="/" className="text-[13px] font-medium uppercase tracking-[0.1em] text-forest-depths underline hover:opacity-70 transition-opacity">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full bg-snow-white mt-auto border-t border-warm-stone">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-pewter">
          <p>© 2026 Guardian Skincare Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;