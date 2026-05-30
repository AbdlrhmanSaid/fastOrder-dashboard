"use client";
import { useOrders } from "@/hooks/useOrders";
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
import OrderDetailsPopUp from "./OrderDetailsPopUp";

const statusConfig: any = {
  معلق: { color: "bg-yellow-100 text-yellow-700", label: "معلق" },
  "جاري التجهيز": { color: "bg-indigo-100 text-indigo-700", label: "جاري التجهيز" },
  "تم التوصيل": { color: "bg-green-100 text-green-700", label: "تم التوصيل" },
  ملغي: { color: "bg-red-100 text-red-700", label: "ملغي" },
};

export default function OrdersTable() {
  const { orders, isLoading } = useOrders();

  if (isLoading)
    return <div className="p-10 text-center">جاري تحميل الطلبات...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" dir="rtl">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-slate-200">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right py-4 font-bold text-slate-700">رقم الطلب</TableHead>
            <TableHead className="text-right py-4 font-bold text-slate-700">العميل</TableHead>
            <TableHead className="text-right py-4 font-bold text-slate-700">التاريخ</TableHead>
            <TableHead className="text-right py-4 font-bold text-slate-700">المنطقة</TableHead>
            <TableHead className="text-right py-4 font-bold text-slate-700">الإجمالي</TableHead>
            <TableHead className="text-right py-4 font-bold text-slate-700">الحالة</TableHead>
            <TableHead className="text-center py-4 font-bold text-slate-700">التفاصيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order: any) => (
            <TableRow key={order._id} className="hover:bg-slate-50/80 transition-colors">
              <TableCell className="font-mono text-xs font-semibold text-slate-500 py-3">
                #{order.orderNumber}
              </TableCell>
              <TableCell className="py-3">
                <div className="font-bold text-slate-800">{order.customerName}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{order.phone}</div>
              </TableCell>
              <TableCell className="text-sm font-medium text-slate-600 py-3">
                {format(new Date(order.createdAt), "dd MMMM yyyy", {
                  locale: ar,
                })}
              </TableCell>
              <TableCell className="py-3 font-medium text-slate-700">{order.area}</TableCell>
              <TableCell className="font-black text-indigo-600 py-3">
                {order.totalAmount} ج.م
              </TableCell>
              <TableCell className="py-3">
                <Badge
                  className={`${statusConfig[order.status]?.color} border-none px-3 py-1 text-xs font-bold shadow-sm`}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-3">
                <OrderDetailsPopUp order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
