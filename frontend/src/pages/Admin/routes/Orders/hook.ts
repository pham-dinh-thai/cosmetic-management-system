import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ordersService,
  openOrderReceiptPrint,
  type OrderDetailReadModel,
  type OrderReadModel,
  type OrderStatus,
  type OrderPaymentStatus,
} from '../../../../services/orders.service';
import type { StatusFilter } from './type';

type ConfirmAction = {
  isOpen: boolean;
  order: OrderReadModel | null;
  status: OrderStatus | null;
  label: string;
  destructive: boolean;
};

const EMPTY_CONFIRM: ConfirmAction = {
  isOpen: false,
  order: null,
  status: null,
  label: '',
  destructive: false,
};

export function useOrders() {
  const [orders, setOrders] = useState<OrderReadModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(EMPTY_CONFIRM);
  const [detailOrder, setDetailOrder] = useState<{ order: OrderReadModel; detail: OrderDetailReadModel } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    order: OrderReadModel,
    nextStatus: OrderStatus,
    label: string,
    destructive = false,
  ) => {
    if (destructive) {
      setConfirmAction({
        isOpen: true,
        order,
        status: nextStatus,
        label,
        destructive: true,
      });
      return;
    }

    try {
      await ordersService.updateOrderStatus(order.id, nextStatus);
      toast.success(`Đã cập nhật trạng thái: ${label}`);
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction.order || !confirmAction.status) {
      return;
    }

    try {
      await ordersService.updateOrderStatus(
        confirmAction.order.id,
        confirmAction.status,
      );
      toast.success(`Đã cập nhật trạng thái: ${confirmAction.label}`);
      setConfirmAction(EMPTY_CONFIRM);
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const handlePaymentStatusChange = async (
    order: OrderReadModel,
    nextPaymentStatus: OrderPaymentStatus,
  ) => {
    if (order.paymentStatus === 'PAID') {
      toast.error('Đơn hàng đã thanh toán, không thể thay đổi lại trạng thái.');
      return;
    }

    try {
      await ordersService.updateOrderPaymentStatus(order.id, nextPaymentStatus);
      toast.success(
        nextPaymentStatus === 'PAID'
          ? 'Đã cập nhật: Đã thanh toán'
          : 'Đã cập nhật: Chưa thanh toán'
      );
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật trạng thái thanh toán');
    }
  };

  const handleViewDetail = useCallback(async (order: OrderReadModel) => {
    if (loadingDetail) return;
    try {
      setLoadingDetail(true);
      const detail = await ordersService.getOrderById(order.id);
      setDetailOrder({ order, detail });
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải chi tiết đơn hàng');
    } finally {
      setLoadingDetail(false);
    }
  }, [loadingDetail]);

  const handlePrintOrder = useCallback(async (order: OrderReadModel) => {
    await openOrderReceiptPrint(order.id);
  }, []);

  const filtered = orders.filter((o) => {
    const matchesQ = !q || o.code.toLowerCase().includes(q.toLowerCase()) || (o.customerName && o.customerName.toLowerCase().includes(q.toLowerCase()));
    const matchesStatus = status === 'all' || o.status === status;
    return matchesQ && matchesStatus;
  });

  return {
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
    handlePaymentStatusChange,
    detailOrder,
    setDetailOrder,
    loadingDetail,
    handleViewDetail,
    handlePrintOrder,
  };
}