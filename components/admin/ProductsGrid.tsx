"use client";
import { useProducts } from "@/hooks/useProducts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
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
import EditProductPopUp from "./EditProductPopUp";
import { Switch } from "@/components/ui/switch";

const ProductsGrid = () => {
  const { products, deleteProduct } = useProducts();

  return (
    <>
      {products?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">
            قائمة المنتجات فارغة
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            لم تقم بإضافة أي عروض بعد. اضغط على زر "إضافة عرض جديد" للبدء.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    </>
  );
};

const ProductCard = ({
  product,
  onDelete,
}: {
  product: any;
  onDelete: any;
}) => {
  // استدعاء دالة التحديث هنا لتكون متاحة للكارت
  const { updateProduct } = useProducts();

  const toggleStock = (checked: boolean) => {
    const formData = new FormData();
    formData.append("inStock", String(checked));
    // نرسل الـ id والحالة الجديدة للباك إند
    updateProduct({ id: product._id, data: formData });
  };

  return (
    <Card
      className={`group overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white ${
        !product.inStock ? "opacity-70 grayscale-[0.3]" : ""
      }`}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={product.images?.[0] || product.image || ""}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              غير متوفر
            </span>
          </div>
        )}
        {product.images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {product.images.length} صور
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-sm font-black text-indigo-700 border border-white/50">
          {product.price} <span className="text-[10px] text-slate-500 uppercase">ج.م / {product.unit}</span>
        </div>
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
        <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1">{product.name}</CardTitle>
        <Switch
          className="flex-row-reverse"
          checked={product.inStock}
          onCheckedChange={toggleStock}
        />
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <p className="text-sm text-slate-500 mt-1">
          {product.inStock ? "المنتج متاح للطلب" : "المنتج غير متاح حالياً"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 p-4 bg-slate-50/50">
        <EditProductPopUp product={product} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="ml-1 h-4 w-4" /> حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="text-right" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف المنتج "{product.name}" نهائياً من القائمة ولا يمكن
                التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2">
              <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(product._id)}
                className="bg-red-600 hover:bg-red-700"
              >
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProductsGrid;
