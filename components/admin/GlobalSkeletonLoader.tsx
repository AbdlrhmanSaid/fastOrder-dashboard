"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalSkeletonLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full"
      >
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
          <div className="bg-indigo-50 p-4 rounded-full border border-indigo-100 relative z-10">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">جاري التحميل...</h3>
        <p className="text-sm font-medium text-slate-500 text-center">
          يرجى الانتظار بينما نقوم بتهيئة البيانات وعرض لوحة التحكم الخاصة بك
        </p>
      </motion.div>
    </div>
  );
}
