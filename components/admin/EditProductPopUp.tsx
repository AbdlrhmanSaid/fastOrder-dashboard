"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import ProductForm from "./ProductForm";

export default function EditProductPopUp({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600">
          <Edit className="ml-2 h-4 w-4" /> تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل منتج: {product.name}</DialogTitle>
        </DialogHeader>

        {/* نمرر بيانات المنتج الحالي للفورم */}
        <ProductForm
          initialData={product}
          onSuccess={() => setIsOpen(false)}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}
