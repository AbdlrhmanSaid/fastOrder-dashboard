"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Map,
  Gift,
  LogOut,
  Menu,
  X,
  Store
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const menuItems = [
  { name: "الإحصائيات", href: "/", icon: LayoutDashboard },
  { name: "الطلبات", href: "/orders", icon: ShoppingCart },
  { name: "المنتجات", href: "/products", icon: Package },
  { name: "المناطق", href: "/areas", icon: Map },
  { name: "العروض", href: "/offers", icon: Gift },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.replace("/login");
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay للشاشات الصغيرة */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white fixed lg:static inset-y-0 right-0 z-40 flex h-screen w-72 flex-col border-l border-slate-200 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out font-sans",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
        dir="rtl"
      >
        <div className="flex items-center p-6 border-b border-slate-100">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold ml-3 shadow-md shadow-blue-600/20">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            FastOrder
          </span>
        </div>

        <div className="px-6 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">القائمة الرئيسية</p>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center space-x-3 space-x-reverse rounded-xl px-4 py-3.5 transition-all duration-300 gap-3 group relative overflow-hidden",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold",
                )}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-l-full" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="p-4 border-t border-slate-100 mb-4 mx-4 bg-slate-50 rounded-2xl">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-300 gap-2 font-bold group"
          >
            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
