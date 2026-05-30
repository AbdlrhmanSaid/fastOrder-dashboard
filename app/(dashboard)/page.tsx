"use client";

import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useAreas } from "@/hooks/useAreas";
import {
  DollarSign,
  ShoppingBag,
  MapPinned,
  Clock,
  PackageCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { areas } = useAreas();

  // حسابات سريعة
  const totalSales =
    orders?.reduce((acc: number, order: any) => acc + order.totalAmount, 0) ||
    0;
  const pendingOrders =
    orders?.filter((order: any) => order.status === "معلق").length || 0;
  const completedOrders =
    orders?.filter((order: any) => order.status === "وصل").length || 0;

  const stats = [
    {
      title: "إجمالي المبيعات",
      value: `${totalSales.toLocaleString()} ج.م`,
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "طلبات معلقة",
      value: pendingOrders,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "طلبات مكتملة",
      value: completedOrders,
      icon: PackageCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "عدد المنتجات",
      value: products?.length || 0,
      icon: ShoppingBag,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 min-h-screen" dir="rtl">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">لوحة التحكم</h1>
          <p className="text-slate-500 mt-2 font-medium">مرحباً بك في نظام إدارة FastOrder الاحترافي</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold border border-indigo-100 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden bg-white">
            <div className="absolute right-0 top-0 w-1.5 h-full bg-indigo-600"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <stat.icon className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ملخص المناطق */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <MapPinned className="text-indigo-600 h-6 w-6" />
            تغطية المناطق النشطة
          </h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            {areas?.length === 0 ? (
              <CardContent className="p-10 text-center space-y-4">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <MapPinned className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">لا توجد مناطق تغطية حالياً</p>
              </CardContent>
            ) : (
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {areas?.slice(0, 5).map((area: any) => (
                    <div
                      key={area._id}
                      className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-800 text-lg">{area.name}</span>
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                        {area.deliveryPrice} ج.م توصيل
                      </span>
                    </div>
                  ))}
                </div>
                {areas?.length > 5 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-sm text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors">
                      عرض جميع المناطق ({areas.length})
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
