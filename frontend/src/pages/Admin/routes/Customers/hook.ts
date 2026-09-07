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

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customersService.deleteCustomer(id);
      toast.success("Đã xoá khách hàng thành công");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xoá khách hàng");
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
    handleDeleteCustomer 
  };
}
