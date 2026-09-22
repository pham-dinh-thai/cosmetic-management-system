import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../../components/Header';
import CancelOrderModal from '../../components/CancelOrderModal';
import { useCartStore } from '../../store/useCartStore';
import {
  ordersService,
  type OrderDetailReadModel,
  type OrderStatus,
  type OrderPaymentStatus,
} from '../../services/orders.service';
import { productsService, type CosmeticSummary } from '../../services/products.service';

const statusMeta: Record<OrderStatus, { label: string; className: string; description: string }> = {
  PENDING_CONFIRMATION: {
    label: 'Chờ xác nhận',
    className: 'bg-[#fcf9e8] text-[#856b10] border border-[#f0e6b5]',
    description: 'Đơn hàng đã được tạo thành công và đang chờ hệ thống xác nhận.',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    className: 'bg-[#edf5e6] text-[#1c3a13] border border-[#cbe1be]',
    description: 'Đơn hàng đã được xác nhận và chuyển tiếp sang bộ phận xử lý đóng gói.',
  },
  PREPARING: {
    label: 'Đang chuẩn bị hàng',
    className: 'bg-[#edf5e6] text-[#1c3a13] border border-[#cbe1be]',
    description: 'Các sản phẩm trong đơn hàng đang được kiểm tra và đóng gói cẩn thận.',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    className: 'bg-[#eaf2f8] text-[#19517d] border border-[#bdd8ec]',
    description: 'Đơn hàng đã được bàn giao cho đối tác vận chuyển và đang trên đường giao đến bạn.',
  },
  DELIVERED: {
    label: 'Giao thành công',
    className: 'bg-[#1c3a13] text-[#fcfcf7] border border-[#1c3a13]',
    description: 'Đơn hàng đã được giao thành công đến địa chỉ nhận hàng.',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-[#fdf0ed] text-[#9c2b20] border border-[#f7c7c0]',
    description: 'Đơn hàng này đã bị hủy.',
  },
  DELIVERY_FAILED: {
    label: 'Giao thất bại',
    className: 'bg-[#fdf0ed] text-[#9c2b20] border border-[#f7c7c0]',
    description: 'Đơn vị vận chuyển không liên lạc được với người nhận.',
  },
  RETURNED: {
    label: 'Đã hoàn hàng',
    className: 'bg-[#fcf9e8] text-[#856b10] border border-[#f0e6b5]',
    description: 'Kiện hàng đã được hoàn trả về kho lưu trữ.',
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    className: 'bg-[#f2f2ee] text-[#555555] border border-[#deded8]',
    description: 'Yêu cầu hoàn tiền cho đơn hàng đã hoàn tất.',
  },
};

const paymentStatusMeta: Record<OrderPaymentStatus, { label: string; className: string }> = {
  UNPAID: { label: 'Chưa thanh toán', className: 'bg-[#fcf9e8] text-[#856b10] border border-[#f0e6b5]' },
  PAID: { label: 'Đã thanh toán', className: 'bg-[#edf5e6] text-[#1c3a13] border border-[#cbe1be]' },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Thanh toán tiền mặt khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản qua ngân hàng',
  CARD: 'Thanh toán qua thẻ (Visa / Mastercard)',
};

const PROGRESS_STEPS: { key: OrderStatus; label: string; stepNumber: number }[] = [
  { key: 'PENDING_CONFIRMATION', label: 'Đặt hàng', stepNumber: 1 },
  { key: 'CONFIRMED', label: 'Xác nhận', stepNumber: 2 },
  { key: 'PREPARING', label: 'Chuẩn bị hàng', stepNumber: 3 },
  { key: 'SHIPPING', label: 'Đang vận chuyển', stepNumber: 4 },
  { key: 'DELIVERED', label: 'Giao thành công', stepNumber: 5 },
];

function getActiveStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return 0;
    case 'CONFIRMED':
      return 1;
    case 'PREPARING':
      return 2;
    case 'SHIPPING':
      return 3;
    case 'DELIVERED':
      return 4;
    default:
      return -1;
  }
}

const canBuyAgain = (status: OrderStatus): boolean =>
  status === 'DELIVERED' || status === 'CANCELLED';

export const MyOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const replaceAll = useCartStore((s) => s.replaceAll);

  const [order, setOrder] = useState<OrderDetailReadModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [repurchasing, setRepurchasing] = useState(false);
  const [cosmetics, setCosmetics] = useState<Record<string, CosmeticSummary>>({});

  const loadOrderDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await ordersService.getMyOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
      toast.error('Không tìm thấy thông tin đơn hàng');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadOrderDetail();
  }, [loadOrderDetail]);

  useEffect(() => {
    productsService
      .getCosmetics()
      .then((items) => {
        const map: Record<string, CosmeticSummary> = {};
        items.forEach((p) => {
          if (p.name) map[p.name.toLowerCase().trim()] = p;
        });
        setCosmetics(map);
      })
      .catch(() => {});
  }, []);

  const handleConfirmCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const result = await ordersService.cancelMyOrder(order.id);
      setOrder((prev) => (prev ? { ...prev, status: result.status } : null));
      toast.success('Đã hủy đơn hàng thành công');
      setShowCancelModal(false);
    } catch (error) {
      console.error(error);
      toast.error('Không thể hủy đơn hàng vào lúc này');
    } finally {
      setCancelling(false);
    }
  };

  const handleBuyAgain = () => {
    if (!order || order.lines.length === 0) {
      toast.error('Đơn hàng không có sản phẩm để mua lại');
      return;
    }
    setRepurchasing(true);
    try {
      replaceAll(
        order.lines.map((line) => ({
          id: line.variantId,
          productCode: line.variantId,
          name: line.name || `Sản phẩm ${line.variantId}`,
          variantName: line.variantName || 'Mặc định',
          price: line.unitPrice,
          qty: line.quantity,
        })),
      );
      toast.success('Đã thêm tất cả sản phẩm vào giỏ hàng');
      navigate('/checkout');
    } catch (error) {
      console.error(error);
      toast.error('Không thể mua lại sản phẩm');
    } finally {
      setRepurchasing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#fcfcf7] py-12 md:py-16">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10 flex flex-col gap-8">
            <div className="h-6 w-64 bg-[#eeeee9] rounded-md animate-pulse" />
            <div className="h-28 bg-white border border-[#eeeee9] rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="h-96 bg-white border border-[#eeeee9] rounded-3xl animate-pulse" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="h-48 bg-white border border-[#eeeee9] rounded-3xl animate-pulse" />
                <div className="h-48 bg-white border border-[#eeeee9] rounded-3xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#fcfcf7] py-20 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-sans font-light text-[#1c3a13] mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-[#666666] mb-6">Đơn hàng không tồn tại hoặc bạn không có quyền xem thông tin này.</p>
          <Link
            to="/my-orders"
            className="px-6 py-3 rounded-full bg-[#1c3a13] text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </>
    );
  }

  const activeStepIdx = getActiveStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'DELIVERY_FAILED';
  const meta = statusMeta[order.status] || {
    label: order.status,
    className: 'bg-[#eeeee9] text-[#666666]',
    description: '',
  };
  const payMeta = paymentStatusMeta[order.paymentStatus] || {
    label: order.paymentStatus,
    className: 'bg-[#eeeee9] text-[#666666]',
  };

  const subtotal = order.lines.reduce((acc, line) => acc + (line.subtotal || line.unitPrice * line.quantity), 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fcfcf7] py-8 sm:py-12 md:py-16 text-[#1c3a13]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 flex flex-col gap-8 md:gap-10">

          {/* Breadcrumb & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-[13px] text-[#666666]">
              <Link to="/" className="hover:text-[#1c3a13] transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/my-orders" className="hover:text-[#1c3a13] transition-colors">
                Đơn hàng của tôi
              </Link>
              <span>/</span>
              <span className="font-mono text-[#1c3a13] font-medium">{order.code}</span>
            </nav>

            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#1c3a13] hover:underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách đơn hàng
            </Link>
          </div>

          {/* Main Top Card: Order Header & Actions */}
          <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[26px] sm:text-[32px] font-sans font-light text-[#1c3a13] tracking-tight">
                  Đơn hàng <span className="font-mono font-medium">{order.code}</span>
                </h1>
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[12px] font-medium ${meta.className}`}>
                  {meta.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${payMeta.className}`}>
                  {payMeta.label}
                </span>
              </div>
              <p className="text-[14px] text-[#666666] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  Ngày đặt:{' '}
                  <strong className="font-medium text-[#1c3a13]">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
                <span className="hidden sm:inline text-[#eeeee9]">•</span>
                <span>
                  Cập nhật lần cuối:{' '}
                  <span className="text-[#666666]">
                    {new Date(order.updatedAt || order.createdAt).toLocaleDateString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </span>
              </p>
              {meta.description && (
                <p className="text-[13px] text-[#777777] italic mt-1 bg-[#fcfcf7] border border-[#eeeee9] px-4 py-2 rounded-xl inline-block">
                  {meta.description}
                </p>
              )}
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {canBuyAgain(order.status) && (
                <button
                  type="button"
                  onClick={handleBuyAgain}
                  disabled={repurchasing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-medium text-white bg-[#1c3a13] hover:opacity-90 transition-all shadow-[0_2px_8px_rgba(28,58,19,0.15)] disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {repurchasing ? 'Đang thêm...' : 'Mua lại đơn này'}
                </button>
              )}

              {order.status === 'PENDING_CONFIRMATION' && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-[#9c2b20] border border-[#f7c7c0] hover:bg-[#fdf0ed] transition-all cursor-pointer"
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>

          {/* Timeline Stepper Section */}
          <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(28,58,19,0.03)]">
            <h2 className="text-[16px] font-medium tracking-wide uppercase text-[#666666] mb-8">
              Trạng thái tiến trình đơn hàng
            </h2>

            {isCancelled ? (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#fdf0ed] border border-[#f7c7c0]">
                <div className="w-14 h-14 rounded-full bg-[#9c2b20] text-white flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[16px] font-medium text-[#9c2b20]">{meta.label}</h4>
                  <p className="text-[13px] text-[#666666] mt-0.5">{meta.description}</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Stepper Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 relative z-10">
                  {PROGRESS_STEPS.map((step, idx) => {
                    const isCompleted = activeStepIdx >= idx;
                    const isCurrent = activeStepIdx === idx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative group">
                        {/* Circle badge */}
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-semibold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-[#1c3a13] text-white shadow-[0_2px_12px_rgba(28,58,19,0.2)]'
                              : 'bg-[#fcfcf7] border-2 border-[#eeeee9] text-[#999999]'
                          } ${isCurrent ? 'ring-4 ring-[#d3fa99]' : ''}`}
                        >
                          {isCompleted ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step.stepNumber
                          )}
                        </div>

                        {/* Title */}
                        <span
                          className={`text-[14px] font-medium mt-3 ${
                            isCurrent
                              ? 'text-[#1c3a13] font-semibold'
                              : isCompleted
                              ? 'text-[#1c3a13]'
                              : 'text-[#888888]'
                          }`}
                        >
                          {step.label}
                        </span>

                        {isCurrent && (
                          <span className="text-[11px] uppercase tracking-wider text-[#1c3a13] bg-[#d3fa99] px-2 py-0.5 rounded-full font-medium mt-1">
                            Hiện tại
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Connecting Line */}
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#eeeee9] -z-0">
                  <div
                    className="h-full bg-[#1c3a13] transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, (activeStepIdx / (PROGRESS_STEPS.length - 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2-Column Content Grid: Products (Left) + Details & Summary (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Products List (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 md:p-9 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#eeeee9] pb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[20px] font-sans font-medium text-[#1c3a13]">
                      Danh sách sản phẩm
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-[#fcfcf7] border border-[#eeeee9] text-[12px] font-medium text-[#666666]">
                      {order.lines.length} món
                    </span>
                  </div>
                </div>

                {/* Table Column Header (Desktop) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 rounded-xl bg-[#fcfcf7] border border-[#eeeee9] text-[12px] uppercase tracking-wider font-semibold text-[#777777]">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-right">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                </div>

                {/* Products strict 12-col list */}
                <div className="flex flex-col gap-4">
                  {order.lines.map((line) => {
                    const lookup = cosmetics[(line.name || '').toLowerCase().trim()];
                    const imgUrl = lookup?.imageUrl;

                    return (
                      <div
                        key={line.id}
                        className="p-4 sm:p-5 rounded-2xl border border-[#eeeee9] bg-white hover:bg-[#fcfcf7]/60 hover:border-[#deded8] transition-all flex flex-col sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center shadow-xs"
                      >
                        {/* Col 1-6: Product Info (Thumbnail + Name + Variant) */}
                        <div className="sm:col-span-6 flex items-center gap-4 min-w-0">
                          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#fcfcf7] border border-[#eeeee9] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={line.name || 'Sản phẩm'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-[#f7f7f2] text-[#1c3a13] p-2">
                                <svg className="w-8 h-8 text-[#1c3a13]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <h3 className="text-[15px] sm:text-[16px] font-medium text-[#1c3a13] leading-snug line-clamp-2">
                              {line.name || `Mã sản phẩm ${line.variantId}`}
                            </h3>
                            
                            {line.variantName && (
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#fcfcf7] border border-[#eeeee9] text-[12px] font-medium text-[#666666]">
                                  Phân loại: {line.variantName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <span className="font-mono text-[14px] text-[#555555]">
                            {line.unitPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </div>

                        <div className="hidden sm:flex sm:col-span-2 justify-center">
                          <span className="inline-flex items-center justify-center min-w-[36px] px-2.5 py-1 rounded-full bg-[#fcfcf7] border border-[#eeeee9] text-[13px] font-medium text-[#1c3a13]">
                            x{line.quantity}
                          </span>
                        </div>

                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <span className="font-mono text-[16px] font-semibold text-[#1c3a13]">
                            {((line.subtotal || line.unitPrice * line.quantity)).toLocaleString('vi-VN')}₫
                          </span>
                        </div>

                        <div className="sm:hidden mt-3 pt-3 border-t border-[#eeeee9] flex items-center justify-between text-[13px]">
                          <span className="text-[#666666]">
                            {line.unitPrice.toLocaleString('vi-VN')}₫ × {line.quantity}
                          </span>
                          <span className="font-mono text-[15px] font-semibold text-[#1c3a13]">
                            {((line.subtotal || line.unitPrice * line.quantity)).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-1 p-4 rounded-2xl bg-[#fcfcf7] border border-[#eeeee9] text-[13px] text-[#666666] flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#1c3a13] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Tất cả sản phẩm đều được bảo quản ở điều kiện tiêu chuẩn và đóng gói theo quy trình mỹ phẩm chuyên nghiệp.
                  </span>
                </div>
              </div>

              {/* Customer Guarantee Card */}
              <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#edf5e6] border border-[#d8e8ce] text-[#1c3a13] flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-10 h-10 sm:w-11 sm:h-11 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h4 className="text-[17px] font-medium text-[#1c3a13]">Cam kết chất lượng 100% chính hãng</h4>
                  <p className="text-[13px] text-[#666666] leading-relaxed">
                    Hỗ trợ đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc hư hại trong quá trình vận chuyển. Liên hệ hotline CSKH để được trợ giúp tức thì.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Recipient & Shipping Address */}
              <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col gap-6">
                <div className="flex items-center gap-4 sm:gap-5 pb-5 border-b border-[#eeeee9]">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#edf5e6] border border-[#d8e8ce] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-xs">
                    <svg className="w-10 h-10 sm:w-11 sm:h-11 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[19px] sm:text-[20px] font-sans font-medium text-[#1c3a13]">
                      Địa chỉ nhận hàng
                    </h3>
                    <span className="text-[13px] text-[#888888]">Thông tin giao nhận bưu kiện</span>
                  </div>
                </div>

                {/* Content Card with prominent icons & breathing room */}
                <div className="bg-[#fcfcf7]/80 rounded-2xl border border-[#eeeee9] p-5 sm:p-6 flex flex-col gap-5">
                  {/* Recipient Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-2xs">
                      <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">Người nhận</span>
                      <p className="text-[15px] sm:text-[16px] font-semibold text-[#1c3a13]">
                        {order.recipientName || order.customerName || 'Khách hàng'}
                      </p>
                    </div>
                  </div>

                  {/* Recipient Phone */}
                  {order.recipientPhone && (
                    <div className="flex items-center gap-4 pt-4 border-t border-[#eeeee9]/80">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-2xs">
                        <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">Số điện thoại</span>
                        <p className="font-mono text-[15px] font-medium text-[#1c3a13]">{order.recipientPhone}</p>
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  <div className="flex items-start gap-4 pt-4 border-t border-[#eeeee9]/80">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-2xs mt-0.5">
                      <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">Địa chỉ giao hàng</span>
                      <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed">
                        {[order.shippingAddress, order.shippingCity].filter(Boolean).join(', ') || 'Chưa cung cấp'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col gap-6">
                <div className="flex items-center gap-4 sm:gap-5 pb-5 border-b border-[#eeeee9]">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#edf5e6] border border-[#d8e8ce] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-xs">
                    <svg className="w-10 h-10 sm:w-11 sm:h-11 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[19px] sm:text-[20px] font-sans font-medium text-[#1c3a13]">
                      Thanh toán
                    </h3>
                    <span className="text-[13px] text-[#888888]">Hình thức và trạng thái giao dịch</span>
                  </div>
                </div>

                {/* Content Card with prominent icons & breathing room */}
                <div className="bg-[#fcfcf7]/80 rounded-2xl border border-[#eeeee9] p-5 sm:p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-2xs">
                      <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">Phương thức</span>
                      <p className="text-[15px] sm:text-[16px] font-medium text-[#1c3a13] leading-snug">
                        {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[#eeeee9]/80">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#eeeee9] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-2xs">
                      <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] block mb-0.5">Trạng thái</span>
                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-[12px] font-medium ${payMeta.className}`}>
                          {payMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Cost Summary */}
              <div className="bg-white rounded-3xl border border-[#eeeee9] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,58,19,0.03)] flex flex-col gap-6">
                <div className="flex items-center gap-4 sm:gap-5 pb-5 border-b border-[#eeeee9]">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#edf5e6] border border-[#d8e8ce] flex items-center justify-center text-[#1c3a13] shrink-0 shadow-xs">
                    <svg className="w-10 h-10 sm:w-11 sm:h-11 text-[#1c3a13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[19px] sm:text-[20px] font-sans font-medium text-[#1c3a13]">
                      Tổng kết đơn hàng
                    </h3>
                    <span className="text-[13px] text-[#888888]">Chi tiết thanh toán và chi phí</span>
                  </div>
                </div>

                {/* Content Card with generous inner breathing room */}
                <div className="bg-[#fcfcf7]/80 rounded-2xl border border-[#eeeee9] p-5 sm:p-6 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#666666]">Tạm tính tiền hàng</span>
                    <span className="font-mono text-[#1c3a13] font-medium">
                      {subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#666666]">Phí vận chuyển</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#edf5e6] text-[#2b5920] text-[12px] font-medium">
                      Miễn phí
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#eeeee9] flex justify-between items-baseline">
                    <div>
                      <span className="text-[15px] font-semibold text-[#1c3a13] block">Tổng thanh toán</span>
                      <span className="text-[11px] text-[#888888] block mt-0.5">(Đã bao gồm VAT nếu có)</span>
                    </div>
                    <span className="font-mono text-[26px] sm:text-[28px] font-medium text-[#1c3a13]">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {canBuyAgain(order.status) && (
                  <button
                    type="button"
                    onClick={handleBuyAgain}
                    disabled={repurchasing}
                    className="w-full py-3.5 rounded-full text-[14px] font-medium text-white bg-[#1c3a13] hover:bg-[#254e1a] transition-all flex items-center justify-center gap-2.5 shadow-[0_2px_8px_rgba(28,58,19,0.15)] disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {repurchasing ? 'Đang thêm vào giỏ...' : 'Mua lại đơn hàng này'}
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      <CancelOrderModal
        isOpen={showCancelModal}
        orderCode={order.code}
        isLoading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
};

export default MyOrderDetailPage;
