"use client";
import { useOffers } from "@/hooks/useOffers";
import OfferPopUp from "@/components/admin/OfferPopUp";
import EditOfferPopUp from "@/components/admin/EditOfferPopUp"; // استيراد بوب-أب التعديل
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Tag, Gift } from "lucide-react";
import GlobalSkeletonLoader from "@/components/admin/GlobalSkeletonLoader";
import { ViewTransition } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OffersPage() {
  const { offers, isLoading, deleteOffer } = useOffers();

  if (isLoading) return <GlobalSkeletonLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      {/* الرأس - Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">إدارة العروض</h2>
          <p className="text-slate-500 font-medium mt-1">
            تحكم في العروض الترويجية والخصومات الحالية لـ FastOrder
          </p>
        </div>
        <OfferPopUp />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ViewTransition name="offers-list" default="none" enter="fade-in" exit="fade-out">
            {offers?.map((offer: any) => (
              <Card
                key={offer._id}
                className="group overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl"
              >
                <div className="flex flex-col md:flex-row h-full min-h-[220px]">
                  {/* قسم الصورة - Left Side */}
                  <div className="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent hidden md:block" />
                    
                    <div className="absolute top-3 right-3">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Tag className="w-3.5 h-3.5" /> عرض خاص
                      </span>
                    </div>
                  </div>

                  {/* قسم التفاصيل - Right Side */}
                  <CardContent className="flex-1 p-6 flex flex-col justify-between relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-slate-900 line-clamp-1 tracking-tight">
                          {offer.title}
                        </h3>

                        {/* ديالوج الحذف */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors h-8 w-8 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="text-right bg-white border-slate-200 text-slate-900" dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-right text-slate-900">
                                حذف العرض نهائياً؟
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right text-slate-500">
                                هل أنت متأكد من حذف "{offer.title}"؟ لا يمكن
                                التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2 mt-4 justify-start flex-row-reverse">
                              <AlertDialogAction
                                onClick={() => deleteOffer(offer._id)}
                                className="bg-red-600 hover:bg-red-700 font-bold text-white border-0 shadow-sm"
                              >
                                تأكيد الحذف
                              </AlertDialogAction>
                              <AlertDialogCancel className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                                إلغاء
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-2">
                        {offer.description}
                      </p>

                      {/* الأصناف المتضمنة */}
                      {offer.includedItems?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {offer.includedItems.map((item: any, idx: number) => (
                            <span
                              key={idx}
                              className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md text-[11px] border border-slate-200 font-semibold"
                            >
                              {item.name || item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-5">
                      <div className="flex flex-col">
                        <span className="text-[28px] font-black text-indigo-600 leading-none tracking-tight">
                          {offer.price}
                          <span className="text-xs font-bold mr-1.5 text-slate-400 uppercase">
                            ج.م
                          </span>
                        </span>
                      </div>

                      {/* استدعاء بوب-أب التعديل وتمرير بيانات العرض الحالي */}
                      <EditOfferPopUp offer={offer} />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </ViewTransition>
        </div>

      {offers?.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
            <Gift className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            قائمة العروض فارغة
          </h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">
            لم تقم بإضافة أي عروض بعد. اضغط على زر "إضافة عرض جديد" للبدء.
          </p>
        </div>
      )}
    </div>
  );
}
