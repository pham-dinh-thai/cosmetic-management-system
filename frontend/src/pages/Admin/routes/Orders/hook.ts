import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ordersService,
  type OrderDetailReadModel,
  type OrderReadModel,
} from '../../../../services/orders.service';
import type { StatusFilter } from './type';

export function useOrders() {
  const [orders, setOrders] = useState<OrderReadModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [confirmCancel, setConfirmCancel] = useState<{ isOpen: boolean; order: OrderReadModel | null }>({ isOpen: false, order: null });
  const [confirmComplete, setConfirmComplete] = useState<{ isOpen: boolean; order: OrderReadModel | null }>({ isOpen: false, order: null });
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

  const handleCancelOrder = async (id: string) => {
    try {
      await ordersService.cancelOrder(id);
      toast.success('Đã hủy đơn hàng thành công');
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi hủy đơn hàng');
    }
  };

  const handleCancelConfirm = async () => {
    if (confirmCancel.order) {
      await handleCancelOrder(confirmCancel.order.id);
      setConfirmCancel({ isOpen: false, order: null });
    }
  };

  const handleCompleteOrder = async (id: string) => {
    try {
      await ordersService.completeOrder(id);
      toast.success('Đã cập nhật trạng thái hoàn thành đơn hàng');
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật đơn hàng');
    }
  };

  const handleCompleteConfirm = async () => {
    if (confirmComplete.order) {
      await handleCompleteOrder(confirmComplete.order.id);
      setConfirmComplete({ isOpen: false, order: null });
    }
  };

  const handleViewDetail = useCallback(async (order: OrderReadModel) => {
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
    confirmCancel,
    setConfirmCancel,
    handleCancelConfirm,
    confirmComplete,
    setConfirmComplete,
    handleCompleteConfirm,
    detailOrder,
    setDetailOrder,
    loadingDetail,
    handleViewDetail,
  };
}
