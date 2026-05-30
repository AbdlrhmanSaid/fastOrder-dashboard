"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProductForm from "./ProductForm";

const ProductsPopUp = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600">
          <Plus className="ml-2 h-4 w-4" /> إضافة منتج جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة منتج جديد</DialogTitle>
        </DialogHeader>

        <ProductForm mode="add" onSuccess={() => setIsAddOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductsPopUp;
