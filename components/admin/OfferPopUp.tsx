"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOffers } from "@/hooks/useOffers";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // npx shadcn-ui@latest add textarea
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Upload, X, CheckCircle2, Gift } from "lucide-react";
import Image from "next/image";

// 1. تحديد قواعد التحقق بناءً على الداتا الجديدة
const offerSchema = z.object({
  title: z.string().min(2, "عنوان العرض مطلوب"),
  description: z.string().min(5, "وصف العرض مطلوب"),
  price: z.string().min(1, "سعر العرض مطلوب"),
  image: z.any().optional(), // اختيارية في التعديل، إجبارية في الإضافة
});

type OfferFormValues = z.infer<typeof offerSchema>;

const OfferPopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { addOffer, isMutating } = useOffers();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [imageFile]);

  const onSubmit = async (data: OfferFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    addOffer(formData, {
      onSuccess: () => {
        reset();
        setPreview(null);
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600">
          <Plus className="ml-2 h-4 w-4" /> إضافة عرض جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Gift className="text-orange-600 h-5 w-5" /> إضافة تفاصيل العرض
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-4 text-right"
          dir="rtl"
        >
          {/* عنوان العرض */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان العرض (مثلاً: عرض الوليمة)</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="اكتب عنوان جذاب..."
            />
            {errors.title && (
              <p className="text-xs text-red-500">
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* وصف العرض */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف العرض</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="اكتب تفاصيل العرض والهدية..."
              className="resize-none h-20"
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* السعر */}
          <div className="space-y-2">
            <Label htmlFor="price">سعر العرض الإجمالي (ج.م)</Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              placeholder="500"
            />
            {errors.price && (
              <p className="text-xs text-red-500">
                {errors.price.message as string}
              </p>
            )}
          </div>

          {/* الصورة */}
          <div className="space-y-2">
            <Label>صورة العرض</Label>
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">ارفع صورة العرض هنا</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("image")}
                />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    reset({ image: undefined });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600"
            disabled={isMutating}
          >
            {isMutating ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "نشر العرض"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferPopUp;
