import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/Header";
import {
  useCartStore,
  formatVND,
  cartSubtotal,
} from "../../store/useCartStore";

const CheckoutPage = () => {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const subtotal = cartSubtotal(items);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const ref = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    clear();
    setOrderRef(ref);
    setPlaced(true);
    toast.success("Đặt hàng thành công!");
  };

  if (placed) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased flex flex-col bg-snow-white">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-8 w-16 h-16 rounded-full bg-[#d3fa99] text-[#1c3a13] flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1
              className="text-forest-depths"
              style={{
                fontWeight: 350,
                fontSize: "clamp(32px, 4vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              Cảm ơn bạn đã đặt hàng.
            </h1>
            <p className="mt-6 text-[16px] leading-[1.6] text-pewter">
              Đơn hàng <span className="font-mono text-forest-depths font-medium">{orderRef}</span> của bạn
              đã được tiếp nhận. Chúng tôi sẽ liên hệ để xác nhận giao hàng.
            </p>
            <Link
              to="/"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased flex flex-col bg-snow-white">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center">
            <p className="text-[18px] text-pewter mb-8">Giỏ hàng của bạn đang trống.</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased flex flex-col bg-snow-white">
      <Header roleTitle="Customer" />
      
      <main className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Left: Forms */}
        <div className="flex-1 lg:w-3/5 px-6 sm:px-12 py-12 lg:py-20 lg:pl-12 xl:pl-[calc(50vw-600px+48px)] xl:pr-12 border-r border-warm-stone">
          <div className="max-w-xl mx-auto lg:ml-auto lg:mr-0 w-full">
            <h1 
              className="text-forest-depths mb-12"
              style={{
                fontWeight: 350,
                fontSize: "clamp(32px, 4vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              Thông tin giao hàng.
            </h1>

            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              {/* Shipping Address */}
              <section>
                <h2 className="text-[18px] text-forest-depths mb-4" style={{ fontWeight: 400 }}>Giao hàng</h2>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      placeholder="Họ"
                      className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors"
                    />
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      placeholder="Tên"
                      className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors"
                    />
                  </div>
                  
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="Số điện thoại"
                    className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <select 
                        name="province"
                        required
                        className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors appearance-none cursor-pointer pr-10"
                      >
                        <option value="">Tỉnh/Thành phố</option>
                        <option value="HN">Hà Nội</option>
                        <option value="HCM">TP. Hồ Chí Minh</option>
                        <option value="DN">Đà Nẵng</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-depths">▾</span>
                    </div>
                    
                    <div className="relative">
                      <select 
                        name="district"
                        required
                        className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors appearance-none cursor-pointer pr-10"
                      >
                        <option value="">Quận/Huyện</option>
                        <option value="Q1">Quận 1</option>
                        <option value="Q2">Quận 2</option>
                        <option value="Q3">Quận 3</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-depths">▾</span>
                    </div>

                    <div className="relative">
                      <select 
                        name="ward"
                        required
                        className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors appearance-none cursor-pointer pr-10"
                      >
                        <option value="">Phường/Xã</option>
                        <option value="P1">Phường 1</option>
                        <option value="P2">Phường 2</option>
                        <option value="P3">Phường 3</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-depths">▾</span>
                    </div>
                  </div>

                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                    className="w-full bg-transparent border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-forest-depths outline-none transition-colors"
                  />
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-[18px] text-forest-depths mb-4 mt-4" style={{ fontWeight: 400 }}>Thanh toán</h2>
                <div className="border-[1.5px] border-warm-stone rounded-lg flex flex-col">
                  <label className="flex items-center gap-4 p-4 border-b border-warm-stone cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="accent-forest-depths w-4 h-4" />
                    <span className="text-forest-depths">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 cursor-pointer bg-snow-white/50">
                    <input type="radio" name="payment" className="accent-forest-depths w-4 h-4" />
                    <span className="text-forest-depths">Chuyển khoản ngân hàng</span>
                  </label>
                </div>
              </section>

              <button 
                type="submit"
                className="w-full mt-4 inline-flex items-center justify-center rounded-full bg-forest-depths text-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-85 transition-all"
              >
                Hoàn tất đặt hàng
              </button>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="flex-1 lg:w-2/5 px-6 sm:px-12 py-12 lg:py-20 lg:pr-12 xl:pr-[calc(50vw-600px+48px)] xl:pl-12 bg-warm-stone lg:bg-transparent">
          <div className="max-w-md mx-auto lg:ml-0 lg:mr-auto w-full lg:sticky lg:top-24">
            
            <div className="flex flex-col gap-6 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-[8px] flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: item.accent || "#1c3a13" }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-1/2 aspect-square rounded-full bg-white/20 backdrop-blur-sm" />
                      )}
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-forest-depths text-white text-[11px] font-medium flex items-center justify-center border border-white">
                      {item.qty}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[14px] text-forest-depths font-medium">{item.name}</h3>
                    <p className="text-[12px] text-pewter">{item.variantName}</p>
                  </div>
                  
                  <p className="font-[var(--font-seed-sans-mono)] text-[14px] text-forest-depths font-medium">
                    {formatVND(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-8 pb-8 border-b border-pewter/20">
              <input 
                type="text" 
                placeholder="Mã giảm giá"
                className="flex-1 bg-white border-[1.5px] border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-[14px] text-forest-depths outline-none transition-colors"
              />
              <button className="px-6 py-3 rounded-lg border-2 border-forest-depths text-forest-depths font-medium text-[14px] hover:bg-forest-depths hover:text-white transition-all">
                Áp dụng
              </button>
            </div>

            <div className="flex flex-col gap-3 text-[14px] text-forest-depths border-b border-pewter/20 pb-6 mb-6">
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
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-pewter uppercase tracking-[0.1em]">VND</span>
                <span className="font-[var(--font-seed-sans-mono)] text-[24px] font-medium text-forest-depths">{formatVND(subtotal)}</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;