"use client";

import AreasTable from "@/components/admin/AreasTable";
import { useAreas } from "@/hooks/useAreas";
import GlobalSkeletonLoader from "@/components/admin/GlobalSkeletonLoader";
import AreaPopUp from "@/components/admin/AreaPopUp";

export default function AreasPage() {
  const { isLoading } = useAreas();

  if (isLoading) {
    return <GlobalSkeletonLoader type="table" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            إدارة مناطق التوصيل
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            تحكم في أسعار الشحن وتغطية المناطق بكفاءة
          </p>
        </div>

        <AreaPopUp />
      </div>

      <AreasTable />
    </div>
  );
}
