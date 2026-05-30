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
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-right font-bold">المنطقة</TableHead>
            <TableHead className="text-right font-bold">سعر التوصيل</TableHead>
            {/* <TableHead className="text-right font-bold">حالة التوصيل</TableHead> */}
            <TableHead className="text-center font-bold">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-slate-500"
              >
                لا توجد مناطق مضافة حالياً.
              </TableCell>
            </TableRow>
          ) : (
            areas?.map((area: any) => (
              <TableRow
                key={area._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {area.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-bold text-blue-600">
                    <Truck className="h-4 w-4 text-blue-500" />
                    {area.deliveryPrice} ج.م
                  </div>
                </TableCell>
                {/* <TableCell>
                  <div className="flex items-center gap-2 ">
                    <Switch
                      className="flex-row-reverse"
                      checked={area.isAvailable !== false}
                      onCheckedChange={(checked) => {
                        updateArea({
                          id: area._id,
                          data: { isAvailable: checked },
                        });
                      }}
                    />
                    <span className="text-sm">
                      {area.isAvailable !== false ? "متاحة" : "مغلقة"}
                    </span>
                  </div>
                </TableCell> */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {/* زر التعديل - سنربطه بالبوب أب لاحقاً */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button> */}

                    {/* حذف المنطقة */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-right">
                            تأكيد حذف المنطقة
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-right">
                            هل أنت متأكد من حذف منطقة "{area.name}"؟ سيؤثر هذا
                            على خيارات التوصيل المتاحة للعملاء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row-reverse gap-2">
                          <AlertDialogAction
                            onClick={() => deleteArea(area._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            تأكيد الحذف
                          </AlertDialogAction>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
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
