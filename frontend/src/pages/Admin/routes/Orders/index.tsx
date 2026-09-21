import React, { useMemo } from 'react';
import { PageHeader, Input, Select, Button } from '../../../../components/ui/Primitives';
import { DataTable, type Column } from '../../../../components/ui/DataTable';
import { ConfirmModal } from '../../../../components/ui/ConfirmModal';
import { useOrders } from './hook';
import type {
  OrderPaymentStatus,
  OrderStatus,
  OrderReadModel,
} from '../../../../services/orders.service';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PREPARING', label: 'Đang chuẩn bị hàng' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Giao thành công' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'DELIVERY_FAILED', label: 'Giao hàng thất bại' },
  { value: 'RETURNED', label: 'Đã hoàn hàng' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

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
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
};

type NextAction = {
  status: OrderStatus;
  label: string;
  destructive?: boolean;
};

const NEXT_ACTIONS: Record<OrderStatus, NextAction[]> = {
  PENDING_CONFIRMATION: [
    { status: 'CONFIRMED', label: 'Xác nhận' },
    { status: 'CANCELLED', label: 'Hủy đơn', destructive: true },
  ],
  CONFIRMED: [
    { status: 'PREPARING', label: 'Chuẩn bị hàng' },
    { status: 'CANCELLED', label: 'Hủy đơn', destructive: true },
  ],
  PREPARING: [
    { status: 'SHIPPING', label: 'Bắt đầu giao' },
    { status: 'CANCELLED', label: 'Hủy đơn', destructive: true },
  ],
  SHIPPING: [
    { status: 'DELIVERED', label: 'Giao thành công' },
    { status: 'DELIVERY_FAILED', label: 'Giao thất bại', destructive: true },
    { status: 'CANCELLED', label: 'Hủy đơn', destructive: true },
  ],
  DELIVERED: [],
  CANCELLED: [{ status: 'REFUNDED', label: 'Đã hoàn tiền' }],
  DELIVERY_FAILED: [
    { status: 'RETURNED', label: 'Đã hoàn hàng' },
    { status: 'CANCELLED', label: 'Hủy đơn', destructive: true },
  ],
  RETURNED: [{ status: 'REFUNDED', label: 'Đã hoàn tiền' }],
  REFUNDED: [],
};

const OrdersPage: React.FC = () => {
  const {
    filtered,
    loading,
    q,
    setQ,
    status,
    setStatus,
    confirmAction,
    setConfirmAction,
    handleConfirmAction,
    handleStatusChange,
    handleMarkPaid,
    detailOrder,
    setDetailOrder,
    loadingDetail,
    handleViewDetail,
    handlePrintOrder,
  } = useOrders();

  const columns: Column<OrderReadModel>[] = useMemo(
    () => [
      {
        key: 'code',
        header: 'Mã đơn hàng',
        render: (o) => <span className="font-mono text-[12px] font-medium">{o.code}</span>,
      },
      {
        key: 'customerName',
        header: 'Khách hàng',
        render: (o) => <span className="font-medium text-[#1c3a13]">{o.customerName || 'Khách lẻ (Tại quầy)'}</span>,
      },
      {
        key: 'createdAt',
        header: 'Ngày tạo',
        render: (o) => {
          const date = new Date(o.createdAt);
          return <span className="text-[#666666]">{Number.isNaN(date.getTime()) ? o.createdAt : date.toLocaleString('vi-VN')}</span>;
        },
      },
      {
        key: 'totalAmount',
        header: 'Tổng tiền',
        render: (o) => <span className="font-mono font-medium text-[#1c3a13]">{o.totalAmount.toLocaleString('vi-VN')}₫</span>,
      },
      {
        key: 'paymentStatus',
        header: 'Thanh toán',
        render: (o) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${paymentStatusMeta[o.paymentStatus]?.className || 'bg-[#eeeee9] text-[#666666]'}`}
          >
            {paymentStatusMeta[o.paymentStatus]?.label || o.paymentStatus}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Trạng thái',
        render: (o) => {
          const nextActions = NEXT_ACTIONS[o.status] ?? [];
          const badgeClass = `inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${statusMeta[o.status]?.className || 'bg-[#eeeee9] text-[#666666]'}`;

          if (nextActions.length === 0) {
            return (
              <span className={badgeClass}>
                {statusMeta[o.status]?.label || o.status}
              </span>
            );
          }

          return (
            <select
              value={o.status}
              onChange={(e) => {
                const next = e.target.value as OrderStatus;
                const action = nextActions.find((a) => a.status === next);
                if (action) {
                  handleStatusChange(o, action.status, action.label, action.destructive);
                }
              }}
              className={`${badgeClass} border-0 cursor-pointer focus:outline-none`}
            >
              <option value={o.status}>{statusMeta[o.status]?.label || o.status}</option>
              {nextActions.map((action) => (
                <option key={action.status} value={action.status}>
                  {action.label}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        key: 'actions',
        header: 'Thao tác',
        className: 'text-right',
        render: (o) => (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" disabled={loadingDetail} onClick={() => handleViewDetail(o)}>
              Chi tiết
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePrintOrder(o)}>
              In
            </Button>
            {o.paymentStatus === 'UNPAID' && (
              <Button variant="outline" size="sm" onClick={() => handleMarkPaid(o)}>
                Đã thanh toán
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handlePrintOrder, handleViewDetail, handleMarkPaid, handleStatusChange, loadingDetail]
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Kinh doanh"
        title="Đơn hàng khách mua"
        description="Quản lý danh sách các đơn hàng từ khách hàng, hỗ trợ theo dõi trạng thái và doanh thu."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <Input
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[16px] border border-[#eeeee9] overflow-hidden animate-pulse">
          <div className="h-[48px] bg-[#eeeee9]" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[64px] border-t border-[#eeeee9] bg-[#fcfcf7]" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(o) => o.id} empty="Không tìm thấy đơn hàng" />
      )}

      <ConfirmModal
        isOpen={confirmAction.isOpen}
        title="Xác nhận cập nhật đơn hàng"
        message={`Bạn có chắc chắn muốn chuyển đơn hàng "${confirmAction.order?.code}" sang trạng thái "${confirmAction.label}"?`}
        confirmText={confirmAction.label || 'Xác nhận'}
        cancelText="Đóng"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction({ isOpen: false, order: null, status: null, label: '', destructive: false })}
        isDestructive={confirmAction.destructive}
      />

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fcfcf7] border border-[#1c3a13] rounded-2xl p-6 w-[90%] max-w-[720px] max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[20px] text-[#1c3a13] font-medium">
                  Chi tiết đơn hàng {detailOrder.detail.code}
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Khách hàng:{' '}
                  <span className="font-medium text-[#1c3a13]">
                    {detailOrder.order.customerName || 'Khách lẻ (Tại quầy)'}
                  </span>
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${statusMeta[detailOrder.detail.status as OrderStatus]?.className || 'bg-[#eeeee9] text-[#666666]'}`}
              >
                {statusMeta[detailOrder.detail.status as OrderStatus]?.label ||
                  detailOrder.detail.status}
              </span>
            </div>

            {loadingDetail ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-[44px] rounded bg-[#eeeee9]" />
                <div className="h-[44px] rounded bg-[#eeeee9]" />
                <div className="h-[44px] rounded bg-[#eeeee9]" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8a8a8a]">Phương thức thanh toán</span>
                    <span className="font-medium text-[#1c3a13]">
                      {PAYMENT_METHOD_LABEL[detailOrder.order.paymentMethod] || detailOrder.order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8a8a8a]">Trạng thái thanh toán</span>
                    <span className="font-medium text-[#1c3a13]">
                      {paymentStatusMeta[detailOrder.order.paymentStatus]?.label || detailOrder.order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8a8a8a]">Ngày tạo</span>
                    <span className="font-medium text-[#1c3a13]">
                      {(() => {
                        const date = new Date(detailOrder.order.createdAt);
                        return Number.isNaN(date.getTime()) ? detailOrder.order.createdAt : date.toLocaleString('vi-VN');
                      })()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8a8a8a]">Tổng tiền</span>
                    <span className="font-mono font-medium text-[#1c3a13]">
                      {detailOrder.detail.totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#eeeee9] overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-[#f5f5ef] text-left text-[#8a8a8a]">
                        <th className="px-4 py-2.5 font-medium">Sản phẩm (Variant)</th>
                        <th className="px-4 py-2.5 font-medium text-right">Đơn giá</th>
                        <th className="px-4 py-2.5 font-medium text-right">SL</th>
                        <th className="px-4 py-2.5 font-medium text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailOrder.detail.lines.map((line) => (
                        <tr key={line.id} className="border-t border-[#eeeee9]">
                          <td className="px-4 py-2.5 font-mono text-[12px]">{line.variantId}</td>
                          <td className="px-4 py-2.5 text-right font-mono">
                            {line.unitPrice.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-4 py-2.5 text-right">{line.quantity}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-medium">
                            {line.subtotal.toLocaleString('vi-VN')}₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {detailOrder.detail.shippingAddress && (
                  <div className="rounded-[12px] border border-[#eeeee9] p-4 flex flex-col gap-3">
                    <span className="text-[13px] font-medium text-[#1c3a13]">Địa chỉ giao hàng</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#8a8a8a]">Người nhận</span>
                        <span className="font-medium text-[#1c3a13]">
                          {[detailOrder.detail.recipientName, detailOrder.detail.recipientPhone]
                            .filter(Boolean)
                            .join(' — ') || '—'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#8a8a8a]">Địa chỉ</span>
                        <span className="font-medium text-[#1c3a13]">
                          {[detailOrder.detail.shippingAddress, detailOrder.detail.shippingCity]
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => handlePrintOrder(detailOrder.order)}
              >
                In hóa đơn
              </Button>
              <Button variant="outline" onClick={() => setDetailOrder(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;