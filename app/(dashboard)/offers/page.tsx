"use client";
import { useOffers } from "@/hooks/useOffers";
import OfferPopUp from "@/components/admin/OfferPopUp";
import EditOfferPopUp from "@/components/admin/EditOfferPopUp"; // استيراد بوب-أب التعديل
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Tag, Gift } from "lucide-react";
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      {/* الرأس - Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">إدارة العروض</h2>
          <p className="text-slate-500 mt-2 font-medium">
            تحكم في العروض الترويجية والخصومات الحالية لـ FastOrder
          </p>
        </div>
        <OfferPopUp />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {offers?.map((offer: any) => (
            <Card
              key={offer._id}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="flex flex-col md:flex-row h-full min-h-[220px]">
                {/* قسم الصورة - Left Side */}
                <div className="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                      <Tag className="w-3 h-3" /> عرض خاص
                    </span>
                  </div>
                </div>

                {/* قسم التفاصيل - Right Side */}
                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                        {offer.title}
                      </h3>

                      {/* ديالوج الحذف */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="text-right" dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              حذف العرض نهائياً؟
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف "{offer.title}"؟ لا يمكن
                              التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex gap-2 mt-4 justify-start">
                            <AlertDialogCancel className="mt-0">
                              إلغاء
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteOffer(offer._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              تأكيد الحذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>

                    {/* الأصناف المتضمنة */}
                    {offer.includedItems?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {offer.includedItems.map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] border border-indigo-100 font-medium"
                          >
                            {item.name || item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-indigo-600 leading-none">
                        {offer.price}
                        <span className="text-[10px] font-bold mr-1 text-slate-400 uppercase">
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
        </div>
      )}

      {offers?.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">
            قائمة العروض فارغة
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            لم تقم بإضافة أي عروض بعد. اضغط على زر "إضافة عرض جديد" للبدء.
          </p>
        </div>
      )}
    </div>
  );
}
