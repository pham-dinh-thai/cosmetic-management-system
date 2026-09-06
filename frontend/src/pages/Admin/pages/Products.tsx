import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  PageHeader,
  Select,
} from "../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import {
  productsService,
  type CosmeticSummary,
} from "../../../services/products.service";

type StatusFilter = "all" | "active" | "inactive";

interface ProductsProps {
  onAdd?: () => void;
  onViewDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang bán" },
  { value: "inactive", label: "Ngừng bán" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "name", label: "Theo tên A → Z" },
  { value: "variants", label: "Nhiều biến thể trước" },
];

const Products: React.FC<ProductsProps> = ({ onAdd, onViewDetail, onEdit }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<CosmeticSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    productsService
      .getCosmetics()
      .then((data) => setProducts(data))
      .catch(() => setError("Không thể tải danh sách sản phẩm."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (status === "all" ||
          (status === "active" && p.isActive) ||
          (status === "inactive" && !p.isActive)) &&
        (!k ||
          p.code.toLowerCase().includes(k) ||
          p.name.toLowerCase().includes(k) ||
          (p.brand ?? "").toLowerCase().includes(k) ||
          (p.origin ?? "").toLowerCase().includes(k)),
    );

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "variants") {
      list = [...list].sort((a, b) => b.variantCount - a.variantCount);
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
    }

    return list;
  }, [products, q, status, sort]);

  const columns: Column<CosmeticSummary>[] = useMemo(
    () => [
      {
        key: "code",
        header: "Mã SP",
        render: (p) => (
          <span className="font-medium uppercase tracking-[0.06em] text-[12px]">
            {p.code}
          </span>
        ),
      },
      {
        key: "name",
        header: "Sản phẩm",
        render: (p) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-medium text-[#1c3a13]">{p.name}</span>
            {p.description && (
              <span className="text-[12px] text-[#666666] truncate max-w-[320px]">
                {p.description}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "brand",
        header: "Thương hiệu",
        render: (p) => <span className="text-[#666666]">{p.brand ?? "—"}</span>,
      },
      {
        key: "origin",
        header: "Xuất xứ",
        render: (p) => <span className="text-[#666666]">{p.origin ?? "—"}</span>,
      },
      {
        key: "variantCount",
        header: "Biến thể",
        render: (p) => <span className="text-[#666666]">{p.variantCount}</span>,
      },
      {
        key: "isActive",
        header: "Trạng thái",
        render: (p) =>
          p.isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]">
              Đang bán
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]">
              Ngừng bán
            </span>
          ),
      },
      {
        key: "actions",
        header: "Hành động",
        className: "text-right",
        render: (p) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetail && onViewDetail(p.id)}
            >
              Xem chi tiết
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit && onEdit(p.id)}
            >
              Sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50/80"
              disabled={deletingId === p.id}
              onClick={async () => {
                if (
                  !window.confirm(
                    `Bạn có chắc muốn xoá sản phẩm "${p.name}" (${p.code})?`,
                  )
                ) {
                  return;
                }
                setDeletingId(p.id);
                try {
                  await productsService.deleteCosmetic(p.id);
                  setProducts((prev) =>
                    prev.filter((item) => item.id !== p.id),
                  );
                } catch {
                  setError(`Không thể xoá sản phẩm "${p.name}".`);
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              Xoá
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, deletingId],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Sản phẩm"
        title="Sản phẩm"
        description="Danh mục mỹ phẩm Guardian — sữa rửa mặt, tinh chất, kem dưỡng và các sản phẩm chăm sóc da chuyên sâu."
        actions={
          <Button variant="primary" onClick={onAdd}>
            + Thêm sản phẩm
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <Input
            placeholder="Tìm kiếm sản phẩm theo mã, tên, thương hiệu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[16px] border border-[#eeeee9] overflow-hidden animate-pulse">
          <div className="h-[48px] bg-[#eeeee9]" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[64px] border-t border-[#eeeee9] bg-[#fcfcf7]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[16px] border border-[#eeeee9] bg-[#fcfcf7] py-12 text-center text-[14px] text-[#666666]">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(p) => p.id}
          empty="Không tìm thấy sản phẩm phù hợp"
        />
      )}
    </div>
  );
};

export default Products;