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
            <Button variant="ghost" size="sm">
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
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50/80"
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
    </div>
  );
};

export default OrdersPage;
