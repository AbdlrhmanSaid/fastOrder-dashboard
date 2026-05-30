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
    return <div className="p-10 text-center">جاري تحميل الطلبات...</div>;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الرأس */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">إدارة الطلبات</h1>
          <p className="text-slate-600 mt-2">
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
            placeholder="ابحث بالاسم، رقم الهاتف، رقم الطلب، أو المنطقة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* فلتر الحالة */}
        <div className="flex items-center gap-2 md:w-64">
          <Filter className="text-slate-400 h-4 w-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الكل">جميع الحالات</SelectItem>
              <SelectItem value="معلق">معلق</SelectItem>
              <SelectItem value="يتم التحضير">يتم التحضير</SelectItem>
              <SelectItem value="وصل">وصل</SelectItem>
              <SelectItem value="ملغي">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* عداد النتائج */}
      <div className="text-sm text-slate-600">
        عرض {filteredOrders?.length || 0} من {orders?.length || 0} طلب
      </div>

      {/* جدول الطلبات */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المنطقة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-center">التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-slate-500">{order.phone}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {format(new Date(order.createdAt), "dd MMMM yyyy", {
                      locale: ar,
                    })}
                  </TableCell>
                  <TableCell>{order.area}</TableCell>
                  <TableCell className="font-bold text-blue-600">
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
