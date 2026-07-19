"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Search, Filter, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import OrderDetailsPopUp from "@/components/admin/OrderDetailsPopUp";
import GlobalSkeletonLoader from "@/components/admin/GlobalSkeletonLoader";

const statusConfig: any = {
  معلق: { color: "bg-yellow-100 text-yellow-700", label: "معلق" },
  "يتم التحضير": { color: "bg-blue-100 text-blue-700", label: "يتم التحضير" },
  "خرج للتوصيل": {
    color: "bg-purple-100 text-purple-700",
    label: "خرج للتوصيل",
  },
  وصل: { color: "bg-green-100 text-green-700", label: "وصل" },
  ملغي: { color: "bg-red-100 text-red-700", label: "ملغي" },
};

export default function OrdersPage() {
  const { orders, isLoading, deleteAllOrders, isDeletingAll } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  // تصفية الطلبات بناءً على البحث والحالة
  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.area?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "الكل" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteAll = () => {
    if (
      confirm(
        "⚠️ هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه!",
      )
    ) {
      deleteAllOrders();
    }
  };

  if (isLoading)
    return <GlobalSkeletonLoader type="table" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة الطلبات</h1>
          <p className="text-slate-500 mt-1 font-medium">
            عرض وتحديث حالة جميع الطلبات المستلمة
          </p>
        </div>
        {orders && orders.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeletingAll ? "جاري الحذف..." : "حذف جميع الطلبات"}
          </Button>
        )}
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* البحث */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="ابحث بالاسم، رقم الهاتف، رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl"
          />
        </div>

        {/* فلتر الحالة */}
        <div className="flex items-center gap-2 md:w-64">
          <Filter className="text-slate-400 h-4 w-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
              <SelectItem value="الكل" className="hover:bg-slate-50 focus:bg-slate-50">جميع الحالات</SelectItem>
              <SelectItem value="معلق" className="hover:bg-slate-50 focus:bg-slate-50">معلق</SelectItem>
              <SelectItem value="يتم التحضير" className="hover:bg-slate-50 focus:bg-slate-50">يتم التحضير</SelectItem>
              <SelectItem value="وصل" className="hover:bg-slate-50 focus:bg-slate-50">وصل</SelectItem>
              <SelectItem value="ملغي" className="hover:bg-slate-50 focus:bg-slate-50">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* عداد النتائج */}
      <div className="text-sm text-slate-500 font-medium">
        عرض {filteredOrders?.length || 0} من {orders?.length || 0} طلب
      </div>

      {/* جدول الطلبات */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-right font-bold text-slate-500">رقم الطلب</TableHead>
              <TableHead className="text-right font-bold text-slate-500">العميل</TableHead>
              <TableHead className="text-right font-bold text-slate-500">التاريخ</TableHead>
              <TableHead className="text-right font-bold text-slate-500">المنطقة</TableHead>
              <TableHead className="text-right font-bold text-slate-500">الإجمالي</TableHead>
              <TableHead className="text-right font-bold text-slate-500">الحالة</TableHead>
              <TableHead className="text-center font-bold text-slate-500">التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <TableRow 
                  key={order._id}
                  className="hover:bg-slate-50/80 transition-all duration-300 border-slate-100 group"
                >
                  <TableCell className="font-mono text-sm text-slate-500">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{order.customerName}</div>
                    <div className="text-xs text-slate-500 font-medium">{order.phone}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {format(new Date(order.createdAt), "dd MMMM yyyy", {
                      locale: ar,
                    })}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{order.area}</TableCell>
                  <TableCell className="font-bold text-indigo-600">
                    {order.totalAmount} ج.م
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusConfig[order.status]?.color} border-none`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <OrderDetailsPopUp order={order} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-slate-500"
                >
                  لا توجد طلبات تطابق البحث
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
