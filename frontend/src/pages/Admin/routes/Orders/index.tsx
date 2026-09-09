import React, { useMemo } from 'react';
import { PageHeader, Input, Select, Button } from '../../../../components/ui/Primitives';
import { DataTable, type Column } from '../../../../components/ui/DataTable';
import { ConfirmModal } from '../../../../components/ui/ConfirmModal';
import { useOrders } from './hook';
import type { OrderStatus, OrderReadModel } from '../../../../services/orders.service';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ thanh toán', className: 'bg-[#f3f0d9] text-[#9f995b]' },
  PAID: { label: 'Đã thanh toán', className: 'bg-[#e3ecd9] text-[#1c3a13]' },
  COMPLETED: { label: 'Hoàn thành', className: 'bg-[#1c3a13] text-[#fcfcf7]' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-[#f0ded9] text-[#8f3f2a]' },
};

const OrdersPage: React.FC = () => {
  const {
    filtered,
    loading,
    q,
    setQ,
    status,
    setStatus,
    confirmCancel,
    setConfirmCancel,
    confirmComplete,
    setConfirmComplete,
    handleCompleteConfirm,
    handleCancelConfirm,
    detailOrder,
    setDetailOrder,
    loadingDetail,
    handleViewDetail,
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
        key: 'status',
        header: 'Trạng thái',
        render: (o) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${statusMeta[o.status]?.className || 'bg-[#eeeee9] text-[#666666]'}`}
          >
            {statusMeta[o.status]?.label || o.status}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Thao tác',
        className: 'text-right',
        render: (o) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewDetail(o)}>
              Chi tiết
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={o.status === 'CANCELLED' || o.status === 'COMPLETED'}
              onClick={() => setConfirmComplete({ isOpen: true, order: o })}
            >
              Hoàn thành
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              disabled={o.status === 'CANCELLED' || o.status === 'COMPLETED'}
              onClick={() => setConfirmCancel({ isOpen: true, order: o })}
            >
              Hủy đơn
            </Button>
          </div>
        ),
      },
    ],
    [setConfirmCancel]
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
        isOpen={confirmCancel.isOpen}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc chắn muốn hủy đơn hàng "${confirmCancel.order?.code}"? Khách hàng sẽ được thông báo và thao tác này không thể hoàn tác.`}
        confirmText="Hủy đơn hàng"
        cancelText="Đóng"
        onConfirm={handleCancelConfirm}
        onCancel={() => setConfirmCancel({ isOpen: false, order: null })}
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={confirmComplete.isOpen}
        title="Xác nhận hoàn thành đơn hàng"
        message={`Bạn có chắc chắn muốn đánh dấu đơn hàng "${confirmComplete.order?.code}" là hoàn thành? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận"
        cancelText="Đóng"
        onConfirm={handleCompleteConfirm}
        onCancel={() => setConfirmComplete({ isOpen: false, order: null })}
        isDestructive={false}
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
                    <span className="text-[#8a8a8a]">Hình thức</span>
                    <span className="font-medium text-[#1c3a13]">
                      {{ CASH: 'Tiền mặt', BANK_TRANSFER: 'Chuyển khoản', CARD: 'Thẻ' }[detailOrder.order.paymentMethod] || detailOrder.order.paymentMethod}
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
                    <span className="text-[#8a8a8a]">Số dòng</span>
                    <span className="font-medium text-[#1c3a13]">
                      {detailOrder.detail.lines.length}
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
              </>
            )}

            <div className="flex justify-end gap-3 pt-2">
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
