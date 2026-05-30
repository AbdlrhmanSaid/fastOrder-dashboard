"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProducts } from "@/hooks/useProducts";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Images } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// 1. تحديد القواعد (Schema)
const productSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  price: z.string().min(1, "السعر مطلوب"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
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
  // الصور الحالية (موجودة مسبقاً في حالة التعديل)
  const existingImages: string[] =
    initialData?.images ||
    (initialData?.image ? [initialData.image] : []);

  // ملفات الصور الجديدة المختارة
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // معاينة الصور الجديدة
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
      description: initialData?.description || "",
      inStock: initialData?.inStock ?? true,
    },
  });

  const inStockValue = watch("inStock");

  // بناء معاينات الصور الجديدة عند تغيير selectedFiles
  useEffect(() => {
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    // إعادة ضبط الـ input لدعم إعادة الاختيار
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("unit", data.unit);
    formData.append("inStock", String(data.inStock));
    if (data.description) formData.append("description", data.description);

    // إرفاق الصور الجديدة المختارة
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (mode === "add") {
      if (selectedFiles.length === 0) {
        alert("يرجى رفع صورة واحدة على الأقل");
        return;
      }
      addProduct(formData, { onSuccess });
    } else {
      updateProduct({ id: initialData._id, data: formData }, { onSuccess });
    }
  };

  const hasAnyImage = existingImages.length > 0 || newPreviews.length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 pt-4 text-right"
      dir="rtl"
    >
      {/* اسم المنتج */}
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input id="name" {...register("name")} placeholder="اسم المنتج" />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      {/* السعر والوحدة */}
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
          <Select
            onValueChange={(val) =>
              setValue("unit", val, { shouldValidate: true })
            }
            defaultValue={watch("unit")}
          >
            <SelectTrigger id="unit" className="text-right flex-row-reverse">
              <SelectValue placeholder="اختر الوحدة" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="كيلو">كيلو</SelectItem>
              <SelectItem value="قطعة">قطعة</SelectItem>
            </SelectContent>
          </Select>
          {errors.unit && (
            <p className="text-xs text-red-500">
              {errors.unit.message as string}
            </p>
          )}
        </div>
      </div>

      {/* الوصف */}
      <div className="space-y-2">
        <Label htmlFor="description">الوصف (اختياري)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="أكتب وصفاً للمنتج..."
          rows={2}
          className="resize-none"
        />
      </div>

      {/* التوفر */}
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

      {/* صور المنتج */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Images className="w-4 h-4" />
          صور المنتج
          <span className="text-xs text-gray-400 font-normal">(يمكنك رفع أكثر من صورة)</span>
        </Label>

        {/* عرض الصور الحالية في وضع التعديل */}
        {mode === "edit" && existingImages.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">الصور الحالية:</p>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image src={img} alt={`صورة ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-1">
              * رفع صور جديدة سيستبدل الصور الحالية
            </p>
          </div>
        )}

        {/* عرض الصور الجديدة المختارة */}
        {newPreviews.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">الصور المختارة:</p>
            <div className="flex gap-2 flex-wrap">
              {newPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-200 group"
                >
                  <Image src={url} alt={`جديد ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    aria-label="حذف الصورة"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* منطقة رفع الصور */}
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all">
          <div className="flex flex-col items-center justify-center py-3">
            <Upload className="w-6 h-6 mb-1 text-gray-400" />
            <p className="text-sm text-gray-500">اضغط لإضافة صور</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP مسموح بها</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
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
