import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import {
  useCartStore,
  formatVND,
  cartSubtotal,
} from "../../store/useCartStore";
import { ordersService } from "../../services/orders.service";
import {
  customersService,
  combineName,
} from "../../services/customers.service";
import { userService } from "../../services/user.service";
import { employeesService } from "../../services/employees.service";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SavedAddress {
  id: string;
  city: string;
  street: string;
}

interface PlacedOrderInfo {
  id: string;
  ref: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: "cash" | "bank_transfer";
  total: number;
}

const CheckoutPage: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { isAuthenticated } = useAuth();
  const authUserId = useAuthStore((s) => s.user?.id);
  const authUserEmail = useAuthStore((s) => s.user?.email);
  const navigate = useNavigate();

  const loadedUserRef = useRef<string | null>(null);

  // State
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderInfo | null>(null);

  // User addresses & selection
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Recipient info
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);

  // Inline new address creation
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [addingAddressLoading, setAddingAddressLoading] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">("cash");

  // Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);

  const subtotal = cartSubtotal(items);

  // Load user profile & saved addresses
  useEffect(() => {
    if (!isAuthenticated || !authUserId) {
      setLoadingProfile(false);
      return;
    }

    if (loadedUserRef.current === authUserId) {
      setLoadingProfile(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      setLoadingProfile(true);
      try {
        // Fetch customer profile for addresses and phones
        let customerProfile = await customersService.getMe();
        if (!customerProfile) {
          customerProfile = await customersService.ensureMe().catch(() => null);
        }

        // Fetch user profile for standard name
        const userProfile = await userService.getMe().catch(() => null);

        if (!active) return;

        const resolvedAddresses: SavedAddress[] = customerProfile?.addresses ?? [];
        setSavedAddresses(resolvedAddresses);

        // Select first saved address by default
        if (resolvedAddresses.length > 0) {
          setSelectedAddressId((curr) => curr || resolvedAddresses[0].id);
        }

        const storeUser = useAuthStore.getState().user;

        // Resolve phone: check multiple sources in order
        let resolvedPhone =
          customerProfile?.phone?.trim() ||
          customerProfile?.phones?.[0]?.phone?.trim() ||
          customerProfile?.phones?.[customerProfile.phones.length - 1]?.phone?.trim() ||
          storeUser?.phone?.trim() ||
          "";

        // Resolve recipient name: Priority User Profile > Customer Name > Auth User
        let resolvedName =
          combineName(userProfile?.firstName, userProfile?.lastName) ||
          customerProfile?.name ||
          combineName(storeUser?.firstName, storeUser?.lastName) ||
          "";

        // If phone or name is missing, check employee directory (for admin or staff accounts)
        if ((!resolvedPhone || !resolvedName) && authUserId) {
          try {
            const employees = await employeesService.getEmployees();
            const currentEmployee = employees.find(
              (e) =>
                e.userId === authUserId ||
                (authUserEmail && e.email === authUserEmail),
            );
            if (currentEmployee) {
              if (!resolvedPhone && currentEmployee.phone?.trim()) {
                resolvedPhone = currentEmployee.phone.trim();
              }
              if (!resolvedName) {
                resolvedName = combineName(currentEmployee.firstName, currentEmployee.lastName);
              }
            }
          } catch {
            // ignore
          }
        }

        // If phone is still missing, check customer directory
        if (!resolvedPhone && (authUserId || authUserEmail)) {
          try {
            const customers = await customersService.getCustomers();
            const currentCustomer = customers.find(
              (c) =>
                (authUserId && c.userId === authUserId) ||
                (authUserEmail && c.email === authUserEmail),
            );
            if (currentCustomer?.phone?.trim()) {
              resolvedPhone = currentCustomer.phone.trim();
            }
          } catch {
            // ignore
          }
        }

        // If phone is still missing, check order history
        if (!resolvedPhone) {
          try {
            const myOrders = await ordersService.getMyOrders();
            if (myOrders.length > 0) {
              const latestOrder = await ordersService.getMyOrderById(myOrders[0].id);
              if (latestOrder?.recipientPhone?.trim()) {
                resolvedPhone = latestOrder.recipientPhone.trim();
              }
            }
          } catch {
            // ignore
          }
        }

        if (active) {
          setRecipientName(resolvedName);
          setRecipientPhone(resolvedPhone);
          loadedUserRef.current = authUserId;
        }

        // Sync resolved phone back to Zustand & customer profile if missing
        if (resolvedPhone) {
          if (storeUser?.phone !== resolvedPhone) {
            useAuthStore.getState().setUserProfile({ phone: resolvedPhone });
          }
          if (
            customerProfile &&
            !customerProfile.phone &&
            (!customerProfile.phones || customerProfile.phones.length === 0)
          ) {
            customersService.addMyPhone(resolvedPhone).catch(() => {});
          }
        }
      } catch (err) {
        console.error("Error loading checkout profile data", err);
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, authUserId, authUserEmail]);

  // Handle adding an address inline
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const street = newStreet.trim();
    if (!street) {
      toast.error("Vui lòng nhập địa chỉ nhận hàng.");
      return;
    }

    setAddingAddressLoading(true);
    try {
      let customer = await customersService.getMe();
      if (!customer) {
        customer = await customersService.ensureMe();
      }

      await customersService.addMyAddress(street);

      // Refresh addresses list
      const refreshed = await customersService.getMe();
      const updatedList = refreshed?.addresses ?? [];
      setSavedAddresses(updatedList);

      // Select the newly created address (last or matching)
      const foundNew = updatedList.find((a) => a.street === street) || updatedList[updatedList.length - 1];
      if (foundNew) {
        setSelectedAddressId(foundNew.id);
      }

      setNewStreet("");
      setIsAddingAddress(false);
      toast.success("Đã thêm địa chỉ giao hàng.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Không thể thêm địa chỉ. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setAddingAddressLoading(false);
    }
  };

  // Submit order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để hoàn tất đặt hàng.");
      navigate("/login", { state: { from: "/checkout" }, replace: true });
      return;
    }

    const demoItems = items.filter((item) => !UUID_RE.test(item.id));
    if (demoItems.length > 0) {
      toast.error(
        `Sản phẩm thử nghiệm (${demoItems.map((i) => i.productCode).join(", ")}) không thể đặt hàng. Vui lòng xóa khỏi giỏ.`,
      );
      return;
    }

    const activeAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      toast.error("Vui lòng chọn hoặc thêm địa chỉ nhận hàng.");
      return;
    }

    if (!recipientPhone.trim()) {
      toast.error("Vui lòng cung cấp số điện thoại người nhận.");
      setIsEditingRecipient(true);
      return;
    }

    setSubmitting(true);
    try {
      const customer = await customersService.ensureMe();
      const fullShippingAddress = [activeAddress.street, activeAddress.city]
        .filter(Boolean)
        .join(", ");

      const result = await ordersService.placeOrder({
        customerId: customer.id,
        lines: items.map((item) => ({
          variantId: item.id,
          quantity: item.qty,
        })),
        paymentMethod,
        recipientName: recipientName.trim() || undefined,
        recipientPhone: recipientPhone.trim() || undefined,
        shippingAddress: fullShippingAddress,
        shippingCity: activeAddress.city || undefined,
      });

      const orderRef = `#ORD-${result.id.slice(0, 8).toUpperCase()}`;
      setPlacedOrder({
        id: result.id,
        ref: orderRef,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        shippingAddress: fullShippingAddress,
        paymentMethod,
        total: subtotal,
      });

      clear();
      toast.success("Đặt hàng thành công!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Không thể đặt hàng. Vui lòng kiểm tra lại thông tin.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // State: Order Placed Success
  if (placedOrder) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col text-forest-depths">
        <Header roleTitle="Customer" />

        <main className="flex-1 max-w-[800px] w-full mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-lime-pulse text-forest-depths flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-snow-white border border-warm-stone text-[12px] font-[var(--font-seed-sans-mono)] uppercase tracking-[0.15em] mb-4 text-forest-depths">
              Mã đơn: {placedOrder.ref}
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
              Đơn hàng đã được tiếp nhận.
            </h1>

            <p className="mt-4 text-[16px] text-pewter max-w-lg mx-auto leading-relaxed">
              Cảm ơn quý khách đã tin chọn Seed. Chúng tôi đang chuẩn bị đóng gói sản phẩm và sẽ liên hệ giao hàng sớm nhất.
            </p>
          </div>

          {/* Details Card */}
          <div className="rounded-[16px] bg-snow-white border border-warm-stone p-6 sm:p-8 flex flex-col gap-6 mb-10">
            <h2 className="text-[16px] uppercase tracking-[0.1em] font-medium text-forest-depths border-b border-warm-stone pb-3">
              Thông tin đơn hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[14px]">
              <div>
                <span className="text-pewter block text-[12px] uppercase tracking-[0.05em] mb-1">
                  Người nhận
                </span>
                <p className="font-medium text-forest-depths">
                  {placedOrder.recipientName || "Khách hàng"}
                </p>
                <p className="text-pewter font-[var(--font-seed-sans-mono)] mt-0.5">
                  {placedOrder.recipientPhone}
                </p>
              </div>

              <div>
                <span className="text-pewter block text-[12px] uppercase tracking-[0.05em] mb-1">
                  Hình thức thanh toán
                </span>
                <p className="font-medium text-forest-depths">
                  {placedOrder.paymentMethod === "bank_transfer"
                    ? "Chuyển khoản ngân hàng"
                    : "Thanh toán khi nhận hàng (COD)"}
                </p>
                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-lime-pulse/70 text-forest-depths">
                  {placedOrder.paymentMethod === "bank_transfer" ? "Chờ chuyển khoản" : "Chờ thu tiền"}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-pewter block text-[12px] uppercase tracking-[0.05em] mb-1">
                  Địa chỉ giao hàng
                </span>
                <p className="font-medium text-forest-depths leading-relaxed">
                  {placedOrder.shippingAddress}
                </p>
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-warm-stone flex items-center justify-between">
                <span className="text-[15px] font-medium text-forest-depths">Tổng giá trị đơn hàng</span>
                <span className="font-[var(--font-seed-sans-mono)] text-[22px] font-medium text-forest-depths">
                  {formatVND(placedOrder.total)}
                </span>
              </div>
            </div>

            {placedOrder.paymentMethod === "bank_transfer" && (
              <div className="rounded-[12px] border border-forest-depths/20 bg-snow-white p-5 text-[13px] leading-relaxed">
                <p className="font-medium text-forest-depths mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-forest-depths" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin chuyển khoản ngân hàng:
                </p>
                <div className="font-[var(--font-seed-sans-mono)] text-[13px] space-y-1 text-forest-depths">
                  <p>• Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></p>
                  <p>• Số tài khoản: <strong>0386 888 999</strong></p>
                  <p>• Chủ tài khoản: <strong>SEED COSMETICS VIETNAM</strong></p>
                  <p>• Số tiền: <strong>{formatVND(placedOrder.total)}</strong></p>
                  <p>• Nội dung CK: <strong>{placedOrder.ref.replace('#', '')}</strong></p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/my-orders"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-8 py-4 text-[15px] font-medium tracking-[0.02em] hover:opacity-90 transition-opacity"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-forest-depths text-forest-depths px-8 py-4 text-[15px] font-medium tracking-[0.02em] hover:bg-forest-depths hover:text-snow-white transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // State: Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col text-forest-depths">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-md">
            <p className="text-[20px] text-pewter mb-8 font-light">Giỏ hàng của bạn đang trống.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-8 py-4 text-[15px] font-medium tracking-[0.02em] hover:opacity-90 transition-all"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // State: Not Authenticated
  if (!isAuthenticated && !loadingProfile) {
    return (
      <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col text-forest-depths">
        <Header roleTitle="Customer" />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-md">
            <h1
              className="text-forest-depths mb-4"
              style={{
                fontWeight: 350,
                fontSize: "36px",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              Đăng nhập để thanh toán
            </h1>
            <p className="text-[15px] text-pewter mb-8 leading-relaxed">
              Vui lòng đăng nhập để sử dụng sổ địa chỉ đã lưu và tiến hành đặt hàng một cách an toàn, nhanh chóng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => navigate("/login", { state: { from: "/checkout" } })}
                className="inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-8 py-4 text-[15px] font-medium tracking-[0.02em] hover:opacity-90 transition-all"
              >
                Đăng nhập tài khoản
              </button>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-forest-depths text-forest-depths px-8 py-4 text-[15px] font-medium tracking-[0.02em] hover:bg-forest-depths hover:text-snow-white transition-all"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-snow-white flex flex-col text-forest-depths">
      <Header roleTitle="Customer" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-12 py-10 sm:py-16">
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[14px] text-pewter hover:text-forest-depths transition-colors mb-6 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Quay lại giỏ hàng
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-warm-stone pb-6">
            <div>
              <h1
                className="text-forest-depths"
                style={{
                  fontWeight: 350,
                  fontSize: "clamp(32px, 3.5vw, 42px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                }}
              >
                Xác nhận thanh toán
              </h1>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery & Payment Options */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Recipient Information Container */}
            <div className="rounded-[16px] bg-snow-white border border-warm-stone p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-forest-depths text-snow-white text-[12px] font-medium flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-[18px] text-forest-depths font-medium" style={{ fontWeight: 400 }}>
                    Thông tin người nhận
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingRecipient(!isEditingRecipient)}
                  className="text-[13px] text-forest-depths hover:underline underline-offset-4 cursor-pointer"
                >
                  {isEditingRecipient ? "Đóng chỉnh sửa" : "Thay đổi người nhận"}
                </button>
              </div>

              {!isEditingRecipient ? (
                <div className="rounded-[12px] bg-snow-white border border-warm-stone p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-snow-white border border-warm-stone flex items-center justify-center text-forest-depths font-medium">
                      {(recipientName || "KH").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-forest-depths">
                        {recipientName || "Chưa có tên người nhận"}
                      </p>
                      <p className="text-[13px] text-pewter font-[var(--font-seed-sans-mono)]">
                        {recipientPhone || "Chưa có số điện thoại"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] text-pewter px-3 py-1 rounded-full bg-snow-white border border-warm-stone w-fit">
                    Thông tin mặc định từ tài khoản
                  </span>
                </div>
              ) : (
                <div className="rounded-[12px] border border-forest-depths/30 bg-snow-white p-4 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] text-pewter uppercase tracking-[0.05em]">
                        Họ và tên người nhận
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Nhập họ và tên..."
                        className="w-full bg-snow-white border border-warm-stone focus:border-forest-depths rounded-lg px-4 py-2.5 text-[14px] text-forest-depths outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] text-pewter uppercase tracking-[0.05em]">
                        Số điện thoại liên hệ
                      </label>
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="0912 xxx xxx"
                        className="w-full bg-snow-white border border-warm-stone focus:border-forest-depths rounded-lg px-4 py-2.5 text-[14px] text-forest-depths outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditingRecipient(false)}
                      className="px-4 py-1.5 text-[13px] rounded-full bg-forest-depths text-snow-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Áp dụng cho đơn này
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: User's Saved Addresses Container */}
            <div className="rounded-[16px] bg-snow-white border border-warm-stone p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-forest-depths text-snow-white text-[12px] font-medium flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-[18px] text-forest-depths font-medium" style={{ fontWeight: 400 }}>
                    Địa chỉ nhận hàng
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="text-[13px] text-pewter hover:text-forest-depths transition-colors"
                  >
                    Quản lý sổ địa chỉ →
                  </Link>
                </div>
              </div>

              {loadingProfile ? (
                <div className="flex flex-col gap-3">
                  <div className="h-20 rounded-[12px] bg-warm-stone/30 animate-pulse" />
                  <div className="h-20 rounded-[12px] bg-warm-stone/30 animate-pulse" />
                </div>
              ) : savedAddresses.length === 0 ? (
                /* No Address Found */
                <div className="rounded-[12px] border border-warm-stone p-6 bg-snow-white text-center">
                  <p className="text-[15px] text-forest-depths font-medium mb-1">
                    Bạn chưa có địa chỉ giao hàng nào
                  </p>
                  <p className="text-[13px] text-pewter mb-5">
                    Vui lòng thêm địa chỉ nhận hàng để tiếp tục đặt hàng.
                  </p>

                  <form onSubmit={handleSaveNewAddress} className="max-w-md mx-auto flex flex-col gap-3 text-left">
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                      className="w-full bg-snow-white border border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-[14px] text-forest-depths outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={addingAddressLoading}
                      className="w-full py-3 rounded-full bg-forest-depths text-snow-white text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {addingAddressLoading ? "Đang lưu địa chỉ…" : "Thêm và sử dụng địa chỉ này"}
                    </button>
                  </form>
                </div>
              ) : (
                /* List of User Addresses */
                <div className="flex flex-col gap-3">
                  {savedAddresses.map((addr, idx) => {
                    const isSelected = addr.id === selectedAddressId;
                    const isDefault = idx === 0;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`rounded-[12px] p-4 cursor-pointer border transition-all flex items-start gap-4 ${
                          isSelected
                            ? "border-forest-depths bg-snow-white ring-1 ring-forest-depths"
                            : "border-warm-stone hover:border-frosted-glass bg-snow-white"
                        }`}
                      >
                        {/* Radio selection circle */}
                        <div className="mt-1 flex items-center justify-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-forest-depths"
                                : "border-warm-stone"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-forest-depths" />
                            )}
                          </div>
                        </div>

                        {/* Address detail */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[14px] font-medium text-forest-depths">
                              Địa chỉ {idx + 1}
                            </span>
                            {isDefault && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-lime-pulse text-forest-depths font-medium tracking-[0.02em]">
                                Mặc định
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-forest-depths text-snow-white font-medium">
                                Đang chọn giao
                              </span>
                            )}
                          </div>
                          <p className="text-[14px] text-forest-depths leading-relaxed">
                            {[addr.street, addr.city].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Address Accordion */}
                  {!isAddingAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full border border-forest-depths text-forest-depths text-[14px] font-medium hover:bg-forest-depths hover:text-snow-white transition-colors w-full sm:w-auto self-start cursor-pointer"
                    >
                      <span>+</span> Thêm địa chỉ mới
                    </button>
                  ) : (
                    <div className="rounded-[12px] border border-forest-depths/30 bg-snow-white p-4 mt-2 flex flex-col gap-3">
                      <p className="text-[14px] font-medium text-forest-depths">
                        Thêm địa chỉ giao hàng mới
                      </p>
                      <input
                        type="text"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                        className="w-full bg-snow-white border border-warm-stone focus:border-forest-depths rounded-lg px-4 py-3 text-[14px] text-forest-depths outline-none transition-colors"
                      />
                      <div className="flex items-center gap-3 justify-end mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddress(false);
                            setNewStreet("");
                          }}
                          className="px-4 py-2 text-[13px] text-pewter hover:text-forest-depths transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveNewAddress}
                          disabled={addingAddressLoading}
                          className="px-6 py-2 rounded-full bg-forest-depths text-snow-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                        >
                          {addingAddressLoading ? "Đang lưu…" : "Lưu và sử dụng địa chỉ này"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment Method Container */}
            <div className="rounded-[16px] bg-snow-white border border-warm-stone p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-forest-depths text-snow-white text-[12px] font-medium flex items-center justify-center">
                  3
                </span>
                <h2 className="text-[18px] text-forest-depths font-medium" style={{ fontWeight: 400 }}>
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cash")}
                  className={`rounded-[12px] p-4 cursor-pointer border transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === "cash"
                      ? "border-forest-depths bg-snow-white ring-1 ring-forest-depths"
                      : "border-warm-stone hover:border-frosted-glass bg-snow-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "cash" ? "border-forest-depths" : "border-warm-stone"
                        }`}
                      >
                        {paymentMethod === "cash" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-forest-depths" />
                        )}
                      </div>
                      <span className="text-[15px] font-medium text-forest-depths">
                        Thanh toán khi nhận hàng
                      </span>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-warm-stone bg-snow-white text-forest-depths">
                      COD
                    </span>
                  </div>
                  <p className="text-[13px] text-pewter pl-8 leading-relaxed">
                    Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm tại nhà.
                  </p>
                </div>

                {/* Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`rounded-[12px] p-4 cursor-pointer border transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === "bank_transfer"
                      ? "border-forest-depths bg-snow-white ring-1 ring-forest-depths"
                      : "border-warm-stone hover:border-frosted-glass bg-snow-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "bank_transfer" ? "border-forest-depths" : "border-warm-stone"
                        }`}
                      >
                        {paymentMethod === "bank_transfer" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-forest-depths" />
                        )}
                      </div>
                      <span className="text-[15px] font-medium text-forest-depths">
                        Chuyển khoản ngân hàng
                      </span>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-warm-stone bg-snow-white text-forest-depths">
                      24/7
                    </span>
                  </div>
                  <p className="text-[13px] text-pewter pl-8 leading-relaxed">
                    Chuyển tiền qua mã QR hoặc Internet Banking. Đơn hàng sẽ được xử lý ngay sau khi khớp lệnh.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Sticky Order Summary Container */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-[16px] bg-snow-white border border-warm-stone p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-warm-stone pb-4">
                <h3 className="text-[18px] text-forest-depths font-medium" style={{ fontWeight: 400 }}>
                  Tóm tắt đơn hàng
                </h3>
                <span className="text-[12px] font-[var(--font-seed-sans-mono)] px-2.5 py-0.5 rounded-full bg-snow-white text-forest-depths border border-warm-stone">
                  {items.reduce((acc, cur) => acc + cur.qty, 0)} sản phẩm
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative shrink-0">
                      <div
                        className="w-16 h-16 rounded-[10px] flex items-center justify-center overflow-hidden border border-warm-stone"
                        style={{ backgroundColor: item.accent || "#1c3a13" }}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-1/2 aspect-square rounded-full bg-white/20 backdrop-blur-sm" />
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-forest-depths text-snow-white text-[11px] font-[var(--font-seed-sans-mono)] font-medium flex items-center justify-center border border-snow-white">
                        {item.qty}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] text-forest-depths font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-[12px] text-pewter truncate">
                        {item.variantName}
                      </p>
                      <span className="font-[var(--font-seed-sans-mono)] text-[10px] uppercase text-pewter tracking-[0.05em]">
                        {item.productCode}
                      </span>
                    </div>

                    <p className="font-[var(--font-seed-sans-mono)] text-[14px] text-forest-depths font-medium shrink-0">
                      {formatVND(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher Code */}
              <div className="pt-4 border-t border-warm-stone">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Mã giảm giá / Voucher"
                    className="flex-1 bg-snow-white border border-warm-stone focus:border-forest-depths rounded-lg px-3.5 py-2.5 text-[13px] text-forest-depths outline-none uppercase font-[var(--font-seed-sans-mono)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!voucherCode.trim()) {
                        toast.error("Vui lòng nhập mã ưu đãi.");
                        return;
                      }
                      setVoucherApplied(true);
                      toast.success(`Mã "${voucherCode.toUpperCase()}" đã được ghi nhận.`);
                    }}
                    className="px-4 py-2.5 rounded-full border border-forest-depths text-forest-depths text-[13px] font-medium hover:bg-forest-depths hover:text-snow-white transition-all shrink-0 cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherApplied && (
                  <p className="text-[12px] text-forest-depths mt-1.5 flex items-center gap-1 font-medium">
                    ✓ Mã ưu đãi đã được lưu với đơn hàng
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="flex flex-col gap-2.5 text-[14px] text-forest-depths border-t border-warm-stone pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-pewter">Tạm tính</span>
                  <span className="font-[var(--font-seed-sans-mono)] font-medium">
                    {formatVND(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pewter">Phí vận chuyển</span>
                  <span className="font-[var(--font-seed-sans-mono)] text-forest-depths font-medium flex items-center gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-lime-pulse text-forest-depths">
                      Miễn phí
                    </span>
                    0₫
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="border-t border-warm-stone pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-[16px] font-medium text-forest-depths block">
                    Tổng thanh toán
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-[var(--font-seed-sans-mono)] text-[26px] font-medium text-forest-depths">
                    {formatVND(subtotal)}
                  </span>
                </div>
              </div>

              {/* CTA Complete Order Button */}
              <button
                type="submit"
                disabled={submitting || (savedAddresses.length === 0 && !newStreet.trim())}
                className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-forest-depths text-snow-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-snow-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang hoàn tất đơn hàng…
                  </span>
                ) : (
                  "Hoàn tất đặt hàng"
                )}
              </button>

              {/* Seed Reassurance / Trust Points */}
              <div className="pt-2 flex flex-col gap-2.5 text-[12px] text-pewter border-t border-warm-stone">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-depths" />
                  <span>Cam kết 100% chính hãng & kiểm định nguồn gốc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-depths" />
                  <span>Đóng gói tiêu chuẩn phòng thí nghiệm an toàn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-depths" />
                  <span>Hỗ trợ đổi trả miễn phí trong vòng 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
