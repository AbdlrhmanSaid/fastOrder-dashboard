"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

// 1. تحديد القواعد (Schema)
const productSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  price: z.string().min(1, "السعر مطلوب"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  inStock: z.boolean().optional(),
  image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any; // بيانات المنتج في حالة التعديل
  onSuccess: () => void; // دالة تُنفذ عند النجاح لقفل البوب أب
  mode?: "add" | "edit";
}

const ProductForm = ({
  initialData,
  onSuccess,
  mode = "add",
}: ProductFormProps) => {
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null,
  );
  const { addProduct, updateProduct, isMutating } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price?.toString() || "",
      unit: initialData?.unit || "",
      inStock: initialData?.inStock ?? true,
    },
  });

  const imageFile = watch("image");
  const inStockValue = watch("inStock");

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

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("unit", data.unit);
    formData.append("inStock", String(data.inStock));

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    if (mode === "add") {
      addProduct(formData, { onSuccess });
    } else {
      updateProduct({ id: initialData._id, data: formData }, { onSuccess });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 pt-4 text-right"
      dir="rtl"
    >
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input id="name" {...register("name")} placeholder="اسم المنتج" />
        {errors.name && (
          <p className="text-xs text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر</Label>
          <Input
            id="price"
            type="number"
            {...register("price")}
            placeholder="150"
          />
          {errors.price && (
            <p className="text-xs text-red-500">
              {errors.price.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">الوحدة</Label>
          <Input id="unit" {...register("unit")} placeholder="كيلو / قطعة" />
          {errors.unit && (
            <p className="text-xs text-red-500">
              {errors.unit.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
        <Label htmlFor="inStock" className="cursor-pointer">
          توفر المنتج في المتجر
        </Label>
        <Switch
          id="inStock"
          className="flex-row-reverse"
          checked={inStockValue}
          onCheckedChange={(checked) => setValue("inStock", checked)}
        />
      </div>

      <div className="space-y-2">
        <Label>صورة المنتج</Label>
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">اضغط لرفع صورة</p>
            </div>
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
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-green-400 ml-1" /> تم اختيار
              الصورة
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                reset({ image: undefined });
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {errors.image && (
          <p className="text-xs text-red-500">
            {errors.image.message as string}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={isMutating}
      >
        {isMutating ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...
          </>
        ) : mode === "add" ? (
          "إضافة المنتج"
        ) : (
          "تعديل المنتج"
        )}
      </Button>
    </form>
  );
};

export default ProductForm;
