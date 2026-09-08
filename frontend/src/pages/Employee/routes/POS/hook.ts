import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/useAuthStore";
import { posApi } from "./api";
import type {
  CartItem,
  CosmeticDetail,
  CosmeticSummary,
  CustomerSummary,
  NewCustomerDraft,
  PaymentMethod,
  PaymentOption,
} from "./type";

export const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(value)) + "₫";

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { value: "CASH", label: "Tiền mặt" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "CARD", label: "Thẻ" },
];

export const EMPTY_CUSTOMER: NewCustomerDraft = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export function usePosPage() {
  const user = useAuthStore((s) => s.user);

  const cashierName = useMemo(() => {
    const email = user?.email || "";
    return (
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      email ||
      "Nhân viên"
    );
  }, [user]);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<CosmeticSummary[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [activeCosmetic, setActiveCosmetic] = useState<CosmeticDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSummary | null>(null);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomerDraft>(EMPTY_CUSTOMER);
  const [addingCustomer, setAddingCustomer] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    setLoadingProducts(true);
    posApi
      .getCosmetics()
      .then(setProducts)
      .catch(() => toast.error("Không thể tải danh sách sản phẩm."))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    const k = customerSearch.trim();
    if (!k) {
      setCustomers([]);
      return;
    }
    setSearchingCustomers(true);
    const timer = setTimeout(() => {
      posApi
        .searchCustomers(k)
        .then(setCustomers)
        .catch(() => setCustomers([]))
        .finally(() => setSearchingCustomers(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const filteredProducts = useMemo(() => {
    const k = search.trim().toLowerCase();
    if (!k) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(k) ||
        p.code.toLowerCase().includes(k) ||
        (p.brand ?? "").toLowerCase().includes(k),
    );
  }, [products, search]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const openProduct = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setActiveCosmetic(null);
    try {
      const detail = await posApi.getCosmeticById(id);
      setActiveCosmetic(detail);
    } catch {
      toast.error("Không thể tải chi tiết sản phẩm.");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const closeProduct = useCallback(() => setActiveCosmetic(null), []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, qty: number) => {
      if (qty <= 0) return;

      const sellable = Math.max(0, item.availableStock - item.minStock);

      const alreadyInCart =
        cart.find((c) => c.variantId === item.variantId)?.quantity ?? 0;

      if (sellable <= 0 || alreadyInCart + qty > sellable) {
        toast.warning("Sản phẩm đã hết hàng");
        return;
      }

      setCart((prev) => {
        const idx = prev.findIndex((c) => c.variantId === item.variantId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + qty,
          };
          return next;
        }
        return [...prev, { ...item, quantity: qty }];
      });
      toast.success(`Đã thêm ${qty} × ${item.productName} vào giỏ.`);
    },
    [cart],
  );

  const updateQty = useCallback(
    (variantId: string, qty: number) => {
      setCart((prev) => {
        const item = prev.find((c) => c.variantId === variantId);
        if (!item) return prev;

        const sellable = Math.max(0, item.availableStock - item.minStock);

        if (qty > sellable) {
          toast.warning("Sản phẩm đã hết hàng");
          return prev;
        }

        const next = prev.map((c) =>
          c.variantId === variantId
            ? { ...c, quantity: Math.max(0, qty) }
            : c,
        );

        return next.filter((c) => c.quantity > 0);
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (variantId: string) =>
      setCart((prev) => prev.filter((c) => c.variantId !== variantId)),
    [],
  );

  const handleAddCustomer = useCallback(async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Vui lòng nhập tên và số điện thoại.");
      return;
    }
    setAddingCustomer(true);
    try {
      await posApi.createCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        address: newCustomer.address,
      });
      toast.success("Đã thêm khách hàng.");
      setNewCustomer(EMPTY_CUSTOMER);
      setShowAddCustomer(false);
    } catch {
      toast.error("Không thể thêm khách hàng.");
    } finally {
      setAddingCustomer(false);
    }
  }, [newCustomer]);

  const clearCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setCustomerSearch("");
  }, []);

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      toast.error("Giỏ hàng đang trống.");
      return;
    }
    setCheckingOut(true);
    try {
      const res = await posApi.createOrder({
        customerId: selectedCustomer?.id ?? null,
        items: cart.map((c) => ({
          variantId: c.variantId,
          quantity: c.quantity,
        })),
        paymentMethod,
      });
      toast.success(
        `Thanh toán thành công! Mã đơn ${res.id} — ${formatVND(res.total)}`,
      );
      setCart([]);
      clearCustomer();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Thanh toán thất bại. Vui lòng thử lại.",
      );
    } finally {
      setCheckingOut(false);
    }
  }, [cart, paymentMethod, selectedCustomer, clearCustomer]);

  return {
    cashierName,
    search,
    setSearch,
    products: filteredProducts,
    loadingProducts,
    activeCosmetic,
    loadingDetail,
    openProduct,
    closeProduct,
    customerSearch,
    setCustomerSearch,
    customers,
    searchingCustomers,
    showCustomerList,
    setShowCustomerList,
    selectedCustomer,
    setSelectedCustomer,
    clearCustomer,
    showAddCustomer,
    setShowAddCustomer,
    newCustomer,
    setNewCustomer,
    addingCustomer,
    handleAddCustomer,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    total,
    itemCount,
    paymentMethod,
    setPaymentMethod,
    paymentOptions: PAYMENT_OPTIONS,
    checkingOut,
    handleCheckout,
  };
}