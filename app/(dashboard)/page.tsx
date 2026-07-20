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
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function DashboardPage() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { areas } = useAreas();

  // حسابات سريعة
  const totalSales =
    orders?.reduce((acc: number, order: any) => acc + order.totalAmount, 0) || 0;
  const pendingOrders =
    orders?.filter((order: any) => order.status === "معلق").length || 0;
  const completedOrders =
    orders?.filter((order: any) => order.status === "وصل").length || 0;

  const stats = [
    {
      title: "إجمالي المبيعات",
      value: `${totalSales.toLocaleString()} ج.م`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "طلبات معلقة",
      value: pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "طلبات مكتملة",
      value: completedOrders,
      icon: PackageCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "إجمالي المنتجات",
      value: products?.length || 0,
      icon: ShoppingBag,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  // تحضير بيانات الرسم البياني للمبيعات (مبيعات آخر 7 أيام - بيانات تجريبية أو حقيقية إن وجدت)
  // سنقوم بتجميع الطلبات حسب التاريخ إذا كانت متوفرة
  const salesDataMap: Record<string, number> = {};
  orders?.forEach((order: any) => {
    if (order.createdAt) {
      const date = format(new Date(order.createdAt), "dd MMM", { locale: ar });
      salesDataMap[date] = (salesDataMap[date] || 0) + order.totalAmount;
    }
  });

  const chartData = Object.keys(salesDataMap).length > 0 
    ? Object.keys(salesDataMap).map(date => ({ date, sales: salesDataMap[date] })).slice(-7)
    : [
        { date: "السبت", sales: 1200 },
        { date: "الأحد", sales: 1900 },
        { date: "الإثنين", sales: 800 },
        { date: "الثلاثاء", sales: 2400 },
        { date: "الأربعاء", sales: 1500 },
        { date: "الخميس", sales: 3200 },
        { date: "الجمعة", sales: 4100 },
      ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-8 font-sans" dir="rtl">
      {/* الرأس */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            لوحة القيادة 
            <Activity className="text-blue-500 w-8 h-8" />
          </h1>
          <p className="text-slate-500 mt-2 font-medium">مرحباً بك، إليك ملخص أداء المتجر اليوم.</p>
        </div>
        <div className="bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-bold border border-slate-200 flex items-center gap-2 shadow-sm">
          <Clock className="w-5 h-5 text-blue-500" />
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden bg-white rounded-2xl group">
              <div className={`absolute right-0 top-0 w-1.5 h-full ${stat.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-3 rounded-xl border ${stat.border} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-800 mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* رسم بياني للمبيعات */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <Card className="border-slate-200 shadow-sm bg-white rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <TrendingUp className="text-blue-500" />
                تحليل المبيعات
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">نظرة عامة على مبيعات الأيام الأخيرة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} ج`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="sales" name="المبيعات" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* أحدث الطلبات */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-1"
        >
          <Card className="border-slate-200 shadow-sm bg-white rounded-2xl h-full flex flex-col">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Clock className="text-amber-500" />
                أحدث الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-slate-100">
                {recentOrders.length > 0 ? recentOrders.map((order: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{order.area}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-blue-600">{order.totalAmount} ج.م</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block ${
                        order.status === 'معلق' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'وصل' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500 font-medium">لا توجد طلبات حديثة</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ملخص المناطق */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 gap-8"
      >
        <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <MapPinned className="text-violet-500" />
              المناطق الأكثر طلباً
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {areas?.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <MapPinned className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">لا توجد مناطق تغطية حالياً</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {areas?.slice(0, 4).map((area: any) => (
                  <div
                    key={area._id}
                    className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-violet-200 hover:shadow-sm transition-all"
                  >
                    <span className="font-bold text-slate-800 text-lg mb-2">{area.name}</span>
                    <span className="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-sm font-bold w-fit">
                      {area.deliveryPrice} ج.م توصيل
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
