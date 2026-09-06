import { useMemo, useState } from "react";
import {
  Button,
  Input,
  PageHeader,
  Select,
} from "../../../components/ui/Primitives";

interface Product {
  code: string;
  name: string;
  category: "Sữa rửa mặt" | "Tinh chất" | "Kem dưỡng" | "Toner" | "Mặt nạ";
  volume: string;
  price: string;
  accent: string;
  tag?: string;
}

const PRODUCTS: Product[] = [
  { code: "SC-01®", name: "Sữa rửa mặt vi sinh", category: "Sữa rửa mặt", volume: "150ml", price: "₫420.000", accent: "#1c3a13", tag: "Bán chạy" },
  { code: "AM-02™", name: "Tinh chất sáng da ban ngày", category: "Tinh chất", volume: "30ml", price: "₫680.000", accent: "#9f995b", tag: "Mới" },
  { code: "DM-02™", name: "Huyết thanh cân bằng", category: "Tinh chất", volume: "30ml", price: "₫590.000", accent: "#757c5d" },
  { code: "PM-02™", name: "Kem phục hồi ban đêm", category: "Kem dưỡng", volume: "50ml", price: "₫720.000", accent: "#698e79" },
  { code: "SC-03®", name: "Toner dịu nhẹ", category: "Toner", volume: "200ml", price: "₫380.000", accent: "#757c5d" },
  { code: "MS-04®", name: "Mặt nạ vi sinh", category: "Mặt nạ", volume: "5 miếng", price: "₫280.000", accent: "#d3fa99", tag: "Mới" },
];

const CATEGORIES = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "Sữa rửa mặt", label: "Sữa rửa mặt" },
  { value: "Tinh chất", label: "Tinh chất" },
  { value: "Kem dưỡng", label: "Kem dưỡng" },
  { value: "Toner", label: "Toner" },
  { value: "Mặt nạ", label: "Mặt nạ" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "name", label: "Theo tên A → Z" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const ProductCard: React.FC<{ p: Product }> = ({ p }) => (
  <article className="rounded-[16px] bg-[#fcfcf7] border border-[#eeeee9] overflow-hidden flex flex-col">
    <div
      className="aspect-[4/3] relative flex items-center justify-center"
      style={{ backgroundColor: p.accent }}
    >
      {p.tag && (
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
            p.tag === "Mới"
              ? "bg-[#d3fa99] text-[#1c3a13]"
              : "bg-[#fcfcf7]/20 text-[#fcfcf7] backdrop-blur-[6px]"
          }`}
        >
          {p.tag}
        </span>
      )}
      <div
        className="w-1/3 aspect-square rounded-full"
        style={{ backgroundColor: "rgba(252,252,247,0.18)" }}
      />
    </div>
    <div className="p-5 flex flex-col gap-3 flex-1">
      <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full border border-[#1c3a13] text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c3a13]">
        {p.code}
      </span>
      <h3
        className="text-[#1c3a13]"
        style={{ fontWeight: 350, fontSize: "20px", lineHeight: 1.2, letterSpacing: "-0.48px" }}
      >
        {p.name}
      </h3>
      <p className="text-[12px] uppercase tracking-[0.18em] text-[#666666]">
        {p.category} · {p.volume}
      </p>
      <div className="mt-auto pt-3 flex items-center justify-between">
        <p className="text-[14px] font-medium text-[#1c3a13]">{p.price}</p>
        <Button variant="outline" size="sm">Sửa</Button>
      </div>
    </div>
  </article>
);

const Products: React.FC = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!k ||
          p.code.toLowerCase().includes(k) ||
          p.name.toLowerCase().includes(k)),
    );

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-asc") {
      list = [...list].sort(
        (a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")),
      );
    } else if (sort === "price-desc") {
      list = [...list].sort(
        (a, b) => parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, "")),
      );
    }

    return list;
  }, [q, category, sort]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Sản phẩm"
        title="Sản phẩm"
        description="Danh mục mỹ phẩm Guardian — sữa rửa mặt, tinh chất, kem dưỡng và các sản phẩm chăm sóc da chuyên sâu."
        actions={<Button variant="primary">+ Thêm sản phẩm</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <Input
            placeholder="Tìm kiếm sản phẩm theo mã hoặc tên…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
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

      {filtered.length === 0 ? (
        <div className="rounded-[16px] border border-[#eeeee9] py-16 text-center text-[14px] text-[#666666]">
          Không tìm thấy sản phẩm phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.code} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;