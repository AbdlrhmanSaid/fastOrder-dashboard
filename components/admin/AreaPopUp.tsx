"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAreas } from "@/hooks/useAreas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, MapPinned } from "lucide-react";

// 1. قواعد التحقق
const areaSchema = z.object({
  name: z.string().min(2, "اسم المنطقة مطلوب"),
  deliveryPrice: z.string().min(1, "سعر التوصيل مطلوب"),
});

type AreaFormValues = z.infer<typeof areaSchema>;

const AreaPopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addArea, isMutating } = useAreas();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
  });

  const onSubmit = (data: AreaFormValues) => {
    // تحويل السعر لرقم قبل الإرسال
    addArea(
      {
        name: data.name,
        deliveryPrice: Number(data.deliveryPrice),
      },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" /> إضافة منطقة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-blue-600" />
            إضافة منطقة توصيل جديدة
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 pt-4 text-right"
          dir="rtl"
        >
          <div className="space-y-2">
            <Label htmlFor="name">اسم المنطقة</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="مثلاً: السيوف، سموحة..."
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryPrice">سعر التوصيل (ج.م)</Label>
            <Input
              id="deliveryPrice"
              type="number"
              {...register("deliveryPrice")}
              placeholder="20"
            />
            {errors.deliveryPrice && (
              <p className="text-xs text-red-500">
                {errors.deliveryPrice.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600"
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...
              </>
            ) : (
              "حفظ المنطقة"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AreaPopUp;
