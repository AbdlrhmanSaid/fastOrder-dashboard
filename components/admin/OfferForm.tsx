"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOffers } from "@/hooks/useOffers";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const offerSchema = z.object({
  title: z.string().min(2, "عنوان العرض مطلوب"),
  description: z.string().min(5, "وصف العرض مطلوب"),
  price: z.string().min(1, "سعر العرض مطلوب"),
  image: z.any().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  initialData?: any;
  onSuccess: () => void;
  mode?: "add" | "edit";
}

const OfferForm = ({
  initialData,
  onSuccess,
  mode = "add",
}: OfferFormProps) => {
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null,
  );
  const { addOffer, updateOffer, isMutating } = useOffers();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
    },
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

    // إرسال الصورة فقط إذا تم تغييرها
    if (data.image && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    if (mode === "add") {
      addOffer(formData, {
        onSuccess: () => {
          onSuccess();
          reset();
        },
      });
    } else {
      // التعديل متوافق مع الباك إند الجديد
      updateOffer(
        { id: initialData._id, data: formData },
        { onSuccess: () => onSuccess() },
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 text-right"
      dir="rtl"
    >
      <div className="space-y-2">
        <Label htmlFor="title">عنوان العرض</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="مثلاً: عرض الوليمة"
        />
        {errors.title && (
          <p className="text-xs text-red-500">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف العرض</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="وصف محتويات العرض..."
          className="h-24"
        />
        {errors.description && (
          <p className="text-xs text-red-500">
            {errors.description.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">السعر الإجمالي</Label>
        <Input
          id="price"
          type="number"
          {...register("price")}
          placeholder="500"
        />
      </div>

      <div className="space-y-2">
        <Label>صورة العرض</Label>
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">ارفع الصورة الجديدة هنا</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              {...register("image")}
            />
          </label>
        ) : (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border">
            <Image src={preview} alt="Preview" fill className="object-cover" />
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
        ) : mode === "add" ? (
          "إضافة العرض"
        ) : (
          "تعديل العرض"
        )}
      </Button>
    </form>
  );
};

export default OfferForm;
