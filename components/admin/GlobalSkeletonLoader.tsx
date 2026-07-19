import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalSkeletonLoader({ type = "table" }: { type?: "table" | "cards" | "dashboard" }) {
  if (type === "dashboard") {
    return (
      <div className="space-y-8" dir="rtl">
        <div className="flex justify-between items-end">
          <div>
            <Skeleton className="h-10 w-48 mb-2 bg-slate-200/60" />
            <Skeleton className="h-5 w-64 bg-slate-200/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl bg-white border border-slate-100 shadow-sm" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-3xl bg-white border border-slate-100 shadow-sm" />
          <Skeleton className="h-96 rounded-3xl bg-white border border-slate-100 shadow-sm" />
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="space-y-8" dir="rtl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <Skeleton className="h-10 w-48 mb-2 bg-slate-200/60" />
            <Skeleton className="h-5 w-64 bg-slate-200/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-[340px] w-full rounded-2xl bg-white border border-slate-100 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  // Default Table layout
  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2 bg-slate-200/60" />
          <Skeleton className="h-5 w-64 bg-slate-200/60" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1 rounded-xl bg-white border border-slate-100 shadow-sm" />
        <Skeleton className="h-10 w-full md:w-64 rounded-xl bg-white border border-slate-100 shadow-sm" />
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-4 shadow-sm">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl bg-slate-50 border border-slate-100" />
        ))}
      </div>
    </div>
  );
}
