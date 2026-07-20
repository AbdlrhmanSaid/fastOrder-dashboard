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
import { motion, AnimatePresence } from "framer-motion";

const ProductsGrid = () => {
  const { products, deleteProduct } = useProducts();

  return (
    <>
      {products?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
            <ShoppingBag className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            قائمة المنتجات فارغة
          </h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">
            لم تقم بإضافة أي منتجات بعد. اضغط على زر "إضافة منتج جديد" للبدء.
          </p>
        </div>
      )}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {products?.map((product: any, idx: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              layout
            >
              <ProductCard
                product={product}
                onDelete={deleteProduct}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
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
  const { updateProduct } = useProducts();

  const toggleStock = (checked: boolean) => {
    const formData = new FormData();
    formData.append("inStock", String(checked));
    updateProduct({ id: product._id, data: formData });
  };

  return (
    <Card
      className={`group h-full flex flex-col overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl ${
        !product.inStock ? "opacity-70 grayscale-[0.3]" : ""
      }`}
    >
      <div className="relative h-56 w-full overflow-hidden bg-slate-50/50">
        <Image
          src={product.images?.[0] || product.image || ""}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg">
              غير متوفر
            </span>
          </div>
        )}
        {product.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg font-bold">
            {product.images.length} صور
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-sm text-sm font-black text-blue-600 border border-slate-200/50">
          {product.price} <span className="text-[10px] text-slate-500 uppercase font-bold">ج.م / {product.unit}</span>
        </div>
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-6">
        <CardTitle className="text-xl font-black text-slate-900 line-clamp-1 tracking-tight">{product.name}</CardTitle>
        <Switch
          className="flex-row-reverse shadow-sm data-[state=checked]:bg-blue-600"
          checked={product.inStock}
          onCheckedChange={toggleStock}
        />
      </CardHeader>
      <CardContent className="px-6 pb-5 flex-1">
        <p className="text-sm font-medium text-slate-500">
          {product.inStock ? "المنتج متاح للطلب" : "المنتج غير متاح حالياً"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 p-5 bg-slate-50/50 mt-auto">
        <EditProductPopUp product={product} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-400 font-semibold hover:text-red-600 hover:bg-red-50 rounded-xl px-3 transition-colors">
              <Trash2 className="ml-1.5 h-4 w-4" /> حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="text-right bg-white border-slate-200 rounded-2xl" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900 font-black">هل أنت متأكد تماماً؟</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
                سيتم حذف المنتج "{product.name}" نهائياً من القائمة ولا يمكن
                التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2 flex-row-reverse mt-4">
              <AlertDialogAction
                onClick={() => onDelete(product._id)}
                className="bg-red-600 hover:bg-red-700 font-bold shadow-sm"
              >
                تأكيد الحذف
              </AlertDialogAction>
              <AlertDialogCancel className="mt-0 bg-white border-slate-200 text-slate-700 font-semibold hover:bg-slate-50">إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProductsGrid;
