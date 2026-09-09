import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { customersService } from "../../../../services/customers.service";
import type { Customer } from "./type";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    customersService.getCustomers().then((data) => {
      setCustomers(
        data.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          gender: c.gender,
          phone: c.phone,
          email: c.email,
          address: c.address,
          isActive: c.isActive ?? true,
          orders: 0,
        })),
      );
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleToggleStatus = async (customer: Customer) => {
    try {
      if (customer.isActive) {
        await customersService.deactivateCustomer(customer.id);
        toast.success(`Đã vô hiệu hoá khách hàng "${customer.name}"`);
      } else {
        await customersService.activateCustomer(customer.id);
        toast.success(`Đã kích hoạt lại khách hàng "${customer.name}"`);
      }
      fetchCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đổi trạng thái khách hàng");
    }
  };

  const filtered = customers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q) ||
      c.code.toLowerCase().includes(q.toLowerCase()),
  );

  return {
    customers: filtered,
    loading,
    q,
    setQ,
    handleToggleStatus,
  };
}
