"use client";

import ProductsGrid from "@/components/admin/ProductsGrid";
import ProductsPopUp from "@/components/admin/ProductsPopUp";
import { useProducts } from "@/hooks/useProducts";
import GlobalSkeletonLoader from "@/components/admin/GlobalSkeletonLoader";

export default function ProductsPage() {
  const { isLoading } = useProducts();

  if (isLoading) {
    return <GlobalSkeletonLoader type="cards" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">إدارة المنتجات</h2>
          <p className="text-slate-500 font-medium mt-1">
            أضف، عدل، وتحكم في منتجات المتجر
          </p>
        </div>
        <ProductsPopUp />
      </div>

      <ProductsGrid />
    </div>
  );
}
