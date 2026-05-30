"use client";

import ProductsGrid from "@/components/admin/ProductsGrid";
import ProductsPopUp from "@/components/admin/ProductsPopUp";
import { useProducts } from "@/hooks/useProducts";
import Loading from "@/components/Loading";

export default function ProductsPage() {
  const { isLoading } = useProducts();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <ProductsPopUp />
      </div>

      <ProductsGrid />
    </div>
  );
}
