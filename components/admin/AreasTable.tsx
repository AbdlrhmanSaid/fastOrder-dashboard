"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAreas } from "@/hooks/useAreas";
import { Trash2, Edit, MapPin, Truck, Loader2 } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
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

const AreasTable = () => {
  const { areas, deleteArea } = useAreas();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" dir="rtl">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-slate-100">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="text-right font-bold text-slate-500">المنطقة</TableHead>
            <TableHead className="text-right font-bold text-slate-500">سعر التوصيل</TableHead>
            <TableHead className="text-center font-bold text-slate-500">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-slate-500"
              >
                لا توجد مناطق مضافة حالياً.
              </TableCell>
            </TableRow>
          ) : (
            areas?.map((area: any) => (
              <TableRow
                key={area._id}
                className="hover:bg-slate-50/80 transition-all duration-300 border-slate-100 group"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    <MapPin className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    {area.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-100/50">
                    <Truck className="h-4 w-4" />
                    {area.deliveryPrice} ج.م
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {/* حذف المنطقة */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 bg-transparent border-transparent hover:border-red-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border-slate-200" dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-right text-slate-900">
                            تأكيد حذف المنطقة
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-right text-slate-500">
                            هل أنت متأكد من حذف منطقة "{area.name}"؟ سيؤثر هذا
                            على خيارات التوصيل المتاحة للعملاء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row-reverse gap-2">
                          <AlertDialogAction
                            onClick={() => deleteArea(area._id)}
                            className="bg-red-600 hover:bg-red-700 font-bold text-white border-0 shadow-sm"
                          >
                            تأكيد الحذف
                          </AlertDialogAction>
                          <AlertDialogCancel className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AreasTable;
