"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Gift } from "lucide-react";
import OfferForm from "./OfferForm";

export default function EditOfferPopUp({ offer }: { offer: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <Edit className="ml-2 h-4 w-4" /> تعديل العرض
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Gift className="text-orange-600 h-5 w-5" /> تعديل عرض:{" "}
            {offer.title}
          </DialogTitle>
        </DialogHeader>

        {/* نمرر بيانات العرض للفورم الموحدة */}
        <OfferForm
          initialData={offer}
          mode="edit"
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
