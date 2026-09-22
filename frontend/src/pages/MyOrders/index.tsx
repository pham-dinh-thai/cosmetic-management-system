import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/Header';
import CancelOrderModal from '../../components/CancelOrderModal';
import { ordersService } from '../../services/orders.service';
import { useCartStore } from '../../store/useCartStore';
import {
  type OrderReadModel,
  type OrderDetailReadModel,
  type OrderStatus,
} from '../../services/orders.service';

const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', className: 'bg-[#fcf9e8] text-[#856b10] border border-[#f0e6b5]' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-[#edf5e6] text-[#1c3a13] border border-[#cbe1be]' },
  PREPARING: { label: 'Đang chuẩn bị hàng', className: 'bg-[#edf5e6] text-[#1c3a13] border border-[#cbe1be]' },
  SHIPPING: { label: 'Đang giao', className: 'bg-[#eaf2f8] text-[#19517d] border border-[#bdd8ec]' },
  DELIVERED: { label: 'Giao thành công', className: 'bg-[#1c3a13] text-[#fcfcf7] border border-[#1c3a13]' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-[#fdf0ed] text-[#9c2b20] border border-[#f7c7c0]' },
  DELIVERY_FAILED: { label: 'Giao hàng thất bại', className: 'bg-[#fdf0ed] text-[#9c2b20] border border-[#f7c7c0]' },
  RETURNED: { label: 'Đã hoàn hàng', className: 'bg-[#fcf9e8] text-[#856b10] border border-[#f0e6b5]' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'bg-[#f2f2ee] text-[#555555] border border-[#deded8]' },
};

const canBuyAgain = (status: OrderStatus): boolean =>
  status === 'DELIVERED' || status === 'CANCELLED';

const MyOrdersPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const replaceAll = useCartStore((s) => s.replaceAll);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderReadModel[]>([]);
  const [details, setDetails] = useState<Record<string, OrderDetailReadModel>>({});
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<OrderReadModel | null>(null);
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

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    const orderId = orderToCancel.id;
    setCancellingId(orderId);
    try {
      const result = await ordersService.cancelMyOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: result.status } : o)));
      setDetails((prev) =>
        prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], status: result.status } } : prev,
      );
      toast.success('Đã hủy đơn hàng thành công');
      setOrderToCancel(null);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi hủy đơn hàng');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBuyAgain = async (order: OrderReadModel) => {
    setRepurchasingId(order.id);
    try {
      const detail = details[order.id] ?? (await loadOrderDetail(order.id));
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
          variantName: line.variantName || 'Mặc định',
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
      <div className="min-h-screen bg-[#fcfcf7] py-10 md:py-16 text-[#1c3a13]">
        <div className="max-w-[1140px] mx-auto px-6 sm:px-10 flex flex-col gap-8 md:gap-10">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eeeee9] pb-6">
            <div>
              <nav className="flex items-center gap-2 text-[13px] text-[#666666] mb-2">
                <Link to="/" className="hover:text-[#1c3a13] transition-colors">Trang chủ</Link>
                <span>/</span>
                <span className="text-[#1c3a13] font-medium">Đơn hàng của tôi</span>
              </nav>
              <h1 className="text-[28px] sm:text-[34px] font-sans font-light tracking-tight text-[#1c3a13]">
                Đơn hàng của tôi
              </h1>
              <p className="text-[14px] text-[#666666] mt-1">
                Theo dõi tiến trình vận chuyển, kiểm tra lịch sử và quản lý các đơn hàng bạn đã mua.
              </p>
            </div>
            
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-[#1c3a13] border border-[#eeeee9] bg-white hover:bg-[#eeeee9] transition-all self-start sm:self-auto"
            >
              <svg className="w-4 h-4 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Tiếp tục mua sắm
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[220px] rounded-3xl border border-[#eeeee9] bg-white animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-[#eeeee9] p-8 shadow-[0_4px_20px_rgba(28,58,19,0.02)]">
              <div className="w-20 h-20 rounded-full bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center mb-5 text-[#888888]">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-[20px] font-sans font-medium text-[#1c3a13] mb-2">
                Bạn chưa có đơn hàng nào
              </h3>
              <p className="text-[14px] text-[#666666] max-w-[380px] mb-6 leading-relaxed">
                Khám phá bộ sưu tập mỹ phẩm thiên nhiên và các ưu đãi đặc quyền dành cho bạn.
              </p>
              <Link
                to="/shop"
                className="px-7 py-3 rounded-full bg-[#1c3a13] text-white text-[14px] font-medium hover:opacity-90 transition-all shadow-[0_2px_10px_rgba(28,58,19,0.15)]"
              >
                Khám phá cửa hàng ngay
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const detail = details[order.id];
                const firstLine = detail?.lines[0];
                const extraCount = detail ? detail.lines.length - 1 : 0;
                const meta = statusMeta[order.status] || {
                  label: order.status,
                  className: 'bg-[#eeeee9] text-[#666666] border border-[#deded8]',
                };

                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/my-orders/${order.id}`)}
                    className="bg-white rounded-3xl border border-[#eeeee9] overflow-hidden hover:shadow-[0_8px_32px_rgba(28,58,19,0.06)] hover:border-[#deded8] transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="px-6 sm:px-8 py-5 border-b border-[#eeeee9] flex flex-wrap items-center justify-between gap-4 bg-[#fcfcf7]/60 group-hover:bg-[#fcfcf7] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[15px] font-medium text-[#1c3a13]">
                          #{order.code}
                        </span>
                        <span className="hidden sm:inline-block text-[#eeeee9]">|</span>
                        <span className="text-[13px] text-[#666666]">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.14em] ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-8">
                      {firstLine ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="flex items-center gap-5 flex-1 min-w-0">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center shrink-0 text-[#1c3a13] font-sans font-medium text-xl group-hover:scale-105 transition-transform">
                              {(firstLine.name || firstLine.variantId).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                              <h4 className="text-[16px] font-medium text-[#1c3a13] line-clamp-1 group-hover:text-[#2d5c21] transition-colors">
                                {firstLine.name || `Mã sản phẩm ${firstLine.variantId}`}
                              </h4>
                              {firstLine.variantName && (
                                <span className="text-[13px] text-[#777777]">
                                  Phân loại: {firstLine.variantName}
                                </span>
                              )}
                              <div className="flex items-center gap-3 text-[14px] mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#fcfcf7] border border-[#eeeee9] text-[12px] text-[#666666]">
                                  x{firstLine.quantity}
                                </span>
                                <span className="font-medium text-[#1c3a13]">
                                  {firstLine.unitPrice.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            </div>
                          </div>

                          {extraCount > 0 && (
                            <div className="sm:text-right shrink-0">
                              <span className="inline-flex items-center gap-1 text-[13px] text-[#666666] bg-[#fcfcf7] px-3.5 py-1.5 rounded-full border border-[#eeeee9]">
                                + và <strong>{extraCount}</strong> sản phẩm khác
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 py-2">
                          <div className="w-16 h-16 rounded-2xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center shrink-0 text-[#888888]">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-[15px] font-medium text-[#1c3a13]">
                              Đơn hàng #{order.code}
                            </h4>
                            <p className="text-[13px] text-[#666666]">
                              Bấm để xem danh sách chi tiết các mặt hàng trong đơn
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-[#eeeee9] flex flex-wrap items-center justify-between gap-4 bg-[#fcfcf7]/60">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12px] text-[#666666] uppercase tracking-wider">Tổng tiền:</span>
                        <span className="font-mono text-[20px] sm:text-[22px] font-medium text-[#1c3a13]">
                          {order.totalAmount.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.status === 'PENDING_CONFIRMATION' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToCancel(order);
                            }}
                            className="px-4 py-2 rounded-full text-[13px] font-medium text-[#9c2b20] border border-[#f7c7c0] hover:bg-[#fdf0ed] transition-colors"
                          >
                            Hủy đơn
                          </button>
                        )}

                        {canBuyAgain(order.status) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyAgain(order);
                            }}
                            disabled={repurchasingId === order.id}
                            className="px-4 py-2 rounded-full text-[13px] font-medium text-[#1c3a13] border border-[#eeeee9] bg-white hover:bg-[#fcfcf7] transition-colors disabled:opacity-50"
                          >
                            {repurchasingId === order.id ? 'Đang xử lý...' : 'Mua lại'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/my-orders/${order.id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-medium text-white bg-[#1c3a13] hover:opacity-90 transition-all shadow-[0_2px_8px_rgba(28,58,19,0.12)]"
                        >
                          <span>Xem chi tiết</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      <CancelOrderModal
        isOpen={Boolean(orderToCancel)}
        orderCode={orderToCancel?.code}
        isLoading={Boolean(cancellingId)}
        onConfirm={handleConfirmCancel}
        onClose={() => setOrderToCancel(null)}
      />
    </>
  );
};

export default MyOrdersPage;
