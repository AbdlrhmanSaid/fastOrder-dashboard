"use client";

import AreasTable from "@/components/admin/AreasTable";
import { useAreas } from "@/hooks/useAreas";
import Loading from "@/components/Loading";
import AreaPopUp from "@/components/admin/AreaPopUp";

export default function AreasPage() {
  const { isLoading } = useAreas();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            إدارة مناطق التوصيل
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            تحكم في أسعار الشحن وتغطية المناطق
          </p>
        </div>

        <AreaPopUp />
      </div>

      <AreasTable />
    </div>
  );
}
