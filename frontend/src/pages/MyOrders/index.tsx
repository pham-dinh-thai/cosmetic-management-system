import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/Header';
import { ordersService } from '../../services/orders.service';
import { useCartStore } from '../../store/useCartStore';
import {
  type OrderReadModel,
  type OrderDetailReadModel,
  type OrderStatus,
  type OrderPaymentStatus,
} from '../../services/orders.service';

const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', className: 'bg-[#f3f0d9] text-[#9f995b]' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-[#e3ecd9] text-[#1c3a13]' },
  PREPARING: { label: 'Đang chuẩn bị hàng', className: 'bg-[#e3ecd9] text-[#1c3a13]' },
  SHIPPING: { label: 'Đang giao', className: 'bg-[#dbe7f0] text-[#2a4a6b]' },
  DELIVERED: { label: 'Giao thành công', className: 'bg-[#1c3a13] text-[#fcfcf7]' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-[#f0ded9] text-[#8f3f2a]' },
  DELIVERY_FAILED: { label: 'Giao hàng thất bại', className: 'bg-[#f0ded9] text-[#8f3f2a]' },
  RETURNED: { label: 'Đã hoàn hàng', className: 'bg-[#f3f0d9] text-[#9f995b]' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'bg-[#eeeee9] text-[#666666]' },
};

const paymentStatusMeta: Record<OrderPaymentStatus, { label: string; className: string }> = {
  UNPAID: { label: 'Chưa thanh toán', className: 'bg-[#f3f0d9] text-[#9f995b]' },
  PAID: { label: 'Đã thanh toán', className: 'bg-[#e3ecd9] text-[#1c3a13]' },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
};

const MyOrdersPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const replaceAll = useCartStore((s) => s.replaceAll);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderReadModel[]>([]);
  const [details, setDetails] = useState<Record<string, OrderDetailReadModel>>({});
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState<{ order: OrderReadModel; detail: OrderDetailReadModel | null } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [repurchasingId, setRepurchasingId] = useState<string | null>(null);

  const loadOrderDetail = useCallback(async (orderId: string): Promise<OrderDetailReadModel> => {
    return await ordersService.getMyOrderById(orderId);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = [...(await ordersService.getMyOrders())].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(data);

      const settled = await Promise.allSettled(data.map((order) => loadOrderDetail(order.id)));
      const detailMap: Record<string, OrderDetailReadModel> = {};
      settled.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          detailMap[data[index].id] = result.value;
        }
      });
      setDetails(detailMap);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [user, loadOrderDetail]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setCancellingId(orderId);
    try {
      const result = await ordersService.cancelMyOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: result.status } : o)));
      setDetails((prev) =>
        prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], status: result.status } } : prev,
      );
      setDetailOrder((current) =>
        current && current.order.id === orderId && current.detail
          ? { ...current, order: { ...current.order, status: result.status }, detail: { ...current.detail, status: result.status } }
          : current,
      );
      toast.success('Đã hủy đơn hàng');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi hủy đơn hàng');
    } finally {
      setCancellingId(null);
    }
  };

  const openDetail = async (order: OrderReadModel) => {
    const cached = details[order.id];
    if (cached) {
      setDetailOrder({ order, detail: cached });
      return;
    }

    setDetailOrder({ order, detail: null });
    setLoadingDetail(true);
    try {
      const detail = await loadOrderDetail(order.id);
      setDetails((prev) => ({ ...prev, [order.id]: detail }));
      setDetailOrder({ order, detail });
    } catch (error) {
      console.error(error);
      toast.error('Không tìm thấy chi tiết đơn hàng');
      setDetailOrder(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBuyAgain = async (order: OrderReadModel) => {
    setRepurchasingId(order.id);
    try {
      const detail = details[order.id] ?? await loadOrderDetail(order.id);
      if (!details[order.id]) {
        setDetails((prev) => ({ ...prev, [order.id]: detail }));
      }

      if (detail.lines.length === 0) {
        toast.error('Đơn hàng không có sản phẩm để mua lại');
        return;
      }

      replaceAll(
        detail.lines.map((line) => ({
          id: line.variantId,
          productCode: line.variantId,
          name: line.name || `Sản phẩm ${line.variantId}`,
          variantName: line.name || 'Sản phẩm đã mua',
          price: line.unitPrice,
          qty: line.quantity,
        })),
      );
      navigate('/checkout');
    } catch (error) {
      console.error(error);
      toast.error('Không thể mua lại sản phẩm trong đơn hàng');
    } finally {
      setRepurchasingId(null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fcfcf7] py-12">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col gap-8">
          <div>
            <h1 className="text-[32px] font-serif text-[#1c3a13] mb-2">Đơn hàng của tôi</h1>
            <p className="text-[#666666]">Theo dõi trạng thái và lịch sử các đơn hàng bạn đã mua.</p>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-[200px] rounded-2xl border border-[#eeeee9] bg-white animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#eeeee9]">
              <svg className="w-16 h-16 text-[#eeeee9] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-[18px] font-medium text-[#1c3a13] mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-[14px] text-[#666666]">Hãy khám phá các sản phẩm tuyệt vời của Guardian nhé.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const detail = details[order.id];
                const firstLine = detail?.lines[0];
                const extraCount = detail ? detail.lines.length - 1 : 0;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#eeeee9] overflow-hidden hover:shadow-[0_8px_30px_rgba(28,58,19,0.04)] transition-shadow">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#eeeee9] flex items-center justify-between bg-[#fcfcf7]">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[14px] font-medium text-[#1c3a13]">{order.code}</span>
                        <span className="text-[13px] text-[#666666] hidden sm:inline-block">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.18em] ${statusMeta[order.status]?.className || 'bg-[#eeeee9] text-[#666666]'}`}>
                        {statusMeta[order.status]?.label || order.status}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 cursor-pointer" onClick={() => openDetail(order)}>
                      {firstLine ? (
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center overflow-hidden shrink-0">
                            <span className="text-[#1c3a13] font-serif text-xl">
                              {(firstLine.name || firstLine.variantId).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <h4 className="text-[15px] font-medium text-[#1c3a13] line-clamp-1">
                              {firstLine.name || `Mã sản phẩm ${firstLine.variantId}`}
                            </h4>
                            {firstLine.name && (
                              <span className="text-[13px] text-[#666666]">{firstLine.variantName}</span>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-[14px]">
                              <span className="text-[#666666]">x{firstLine.quantity}</span>
                              <span className="font-medium text-[#1c3a13]">{firstLine.unitPrice.toLocaleString('vi-VN')}₫</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center shrink-0">
                            <svg className="w-8 h-8 text-[#eeeee9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div className="flex-1 flex flex-col gap-2 py-1">
                            <h4 className="text-[15px] font-medium text-[#1c3a13]">
                              {loading ? 'Đang tải thông tin sản phẩm...' : 'Xem chi tiết để biết sản phẩm trong đơn'}
                            </h4>
                            <span className="text-[13px] text-[#666666]">
                              Đơn hàng {order.code} gồm nhiều sản phẩm
                            </span>
                          </div>
                        </div>
                      )}
                      {extraCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#eeeee9] text-[13px] text-[#666666] text-center">
                          Và {extraCount} sản phẩm khác...
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#eeeee9] flex flex-wrap items-center justify-between gap-4 bg-[#fcfcf7]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-[#666666] uppercase tracking-wider">Tổng tiền</span>
                        <span className="font-serif text-[20px] text-[#1c3a13]">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.status === 'PENDING_CONFIRMATION' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                            disabled={cancellingId === order.id}
                            className="px-5 py-2 rounded-full text-[13px] font-medium text-[#8f3f2a] border border-[#f0ded9] hover:bg-[#f0ded9] transition-colors disabled:opacity-50"
                          >
                            {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); openDetail(order); }}
                          className="px-5 py-2 rounded-full text-[13px] font-medium text-white bg-[#1c3a13] hover:opacity-90 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuyAgain(order); }}
                          disabled={repurchasingId === order.id}
                          className="px-5 py-2 rounded-full text-[13px] font-medium text-[#1c3a13] border border-[#1c3a13] hover:bg-[#e3ecd9] transition-colors disabled:opacity-50"
                        >
                          {repurchasingId === order.id ? 'Đang chuẩn bị...' : 'Mua lại'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {detailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6">
            <div className="bg-[#fcfcf7] rounded-3xl w-full max-w-[720px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 md:p-8 border-b border-[#eeeee9] flex items-center justify-between sticky top-0 bg-[#fcfcf7] z-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[22px] text-[#1c3a13] font-serif">Chi tiết đơn hàng</h3>
                  <span className="font-mono text-[13px] text-[#666666]">#{detailOrder.order.code}</span>
                </div>
                <button
                  onClick={() => setDetailOrder(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-[#666666] bg-white border border-[#eeeee9] hover:bg-[#eeeee9] hover:text-[#1c3a13] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-8">
                {loadingDetail || !detailOrder.detail ? (
                  <div className="flex flex-col gap-4 animate-pulse">
                    <div className="h-[64px] rounded-2xl bg-[#eeeee9]" />
                    <div className="h-[120px] rounded-2xl bg-[#eeeee9]" />
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-[96px] rounded-2xl bg-[#eeeee9]" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Status & Date */}
                    <div className="flex items-center gap-4 flex-wrap bg-white p-4 rounded-2xl border border-[#eeeee9]">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] ${statusMeta[detailOrder.detail.status]?.className || 'bg-[#eeeee9] text-[#666666]'}`}>
                        {statusMeta[detailOrder.detail.status]?.label || detailOrder.detail.status}
                      </span>
                      <span className="text-[14px] text-[#666666] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(detailOrder.detail.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment Info */}
                      <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-[#eeeee9]">
                        <div className="flex items-center gap-2 text-[#1c3a13]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <h4 className="text-[14px] font-medium uppercase tracking-wider">Thanh toán</h4>
                        </div>
                        <div className="flex flex-col gap-2 text-[14px] mt-1">
                          <span className="text-[#666666]">Phương thức: <br/><span className="font-medium text-[#1c3a13]">{PAYMENT_METHOD_LABEL[detailOrder.detail.paymentMethod] || detailOrder.detail.paymentMethod}</span></span>
                          <span className="text-[#666666]">
                            Trạng thái: {' '}
                            <span className={detailOrder.detail.paymentStatus === 'PAID' ? 'text-[#1c3a13] font-medium' : 'text-[#8f3f2a] font-medium'}>
                              {paymentStatusMeta[detailOrder.detail.paymentStatus]?.label || detailOrder.detail.paymentStatus}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      {detailOrder.detail.shippingAddress && (
                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-[#eeeee9]">
                          <div className="flex items-center gap-2 text-[#1c3a13]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h4 className="text-[14px] font-medium uppercase tracking-wider">Giao hàng đến</h4>
                          </div>
                          <div className="flex flex-col gap-2 text-[14px] mt-1">
                            <span className="font-medium text-[#1c3a13]">
                              {[detailOrder.detail.recipientName, detailOrder.detail.recipientPhone]
                                .filter(Boolean)
                                .join(' — ') || 'Chưa cập nhật'}
                            </span>
                            <span className="text-[#666666] leading-relaxed">
                              {[detailOrder.detail.shippingAddress, detailOrder.detail.shippingCity]
                                .filter(Boolean)
                                .join(', ') || 'Chưa cập nhật'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Products */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-[18px] font-medium text-[#1c3a13] font-serif">Sản phẩm ({detailOrder.detail.lines.length})</h4>
                      <div className="flex flex-col gap-4">
                        {detailOrder.detail.lines.map((line) => (
                          <div key={line.id} className="flex gap-4 p-4 rounded-2xl bg-white border border-[#eeeee9]">
                            <div className="w-20 h-20 rounded-xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center overflow-hidden shrink-0">
                              <span className="text-[#1c3a13] font-serif text-xl">
                                {(line.name || line.variantId).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 flex flex-col min-w-0 py-1">
                              <h5 className="text-[15px] font-medium text-[#1c3a13] line-clamp-2 leading-snug">
                                {line.name || `Mã sản phẩm ${line.variantId}`}
                              </h5>
                              {line.name && (
                                <span className="text-[12px] text-[#666666] mt-0.5">{line.variantName}</span>
                              )}
                              <div className="flex items-center justify-between mt-auto pt-2">
                                <span className="text-[14px] text-[#666666]">x{line.quantity}</span>
                                <span className="font-medium text-[#1c3a13]">{line.unitPrice.toLocaleString('vi-VN')}₫</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 md:p-8 border-t border-[#eeeee9] bg-white shrink-0 flex items-center justify-between">
                <span className="text-[14px] text-[#666666] uppercase tracking-wider font-medium">Tổng thanh toán</span>
                <span className="font-serif text-[28px] text-[#1c3a13]">
                  {detailOrder.detail
                    ? detailOrder.detail.totalAmount.toLocaleString('vi-VN')
                    : detailOrder.order.totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
