"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import {
  Eye,
  Printer,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";

export default function OrderDetailsPopUp({ order }: { order: any }) {
  const { updateStatus, isUpdating, deleteOrder, isDeleting } = useOrders();
  const printRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open("", "", "width=800,height=900");

    if (windowPrint && printContent) {
      windowPrint.document.write(`
      <html dir="rtl">
        <head>
          <title>فاتورة رقم ${order.orderNumber}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 0; 
              margin: 0;
              color: #000;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 20px;
              border: 1px solid #eee;
              line-height: 24px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #555; }
            
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-box { flex: 1; }
            .info-box h4 { margin: 0 0 5px 0; border-bottom: 1px solid #ddd; display: inline-block; }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th { 
              background: #f8f9fa; 
              border: 1px solid #dee2e6; 
              padding: 10px;
              text-align: right;
            }
            td { 
              border: 1px solid #dee2e6; 
              padding: 10px;
              text-align: right;
            }
            
            .totals {
              width: 40%;
              margin-right: auto;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .final-total {
              border-top: 2px solid #333;
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 10px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div className="invoice-box">
            <div className="header">
              <h1>FastOrder</h1>
              <p>رقم الفاتورة: ${order.orderNumber}</p>
              <p>التاريخ: ${new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
            </div>

            <div className="info-section">
              <div className="info-box">
                <h4>بيانات العميل:</h4>
                <p>الاسم: ${order.customerName}</p>
                <p>الهاتف: ${order.phone}</p>
              </div>
              <div className="info-box">
                <h4>العنوان:</h4>
                <p>المنطقة: ${order.area}</p>
                <p>العنوان بالتفصيل: ${order.address}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity} ${item.unit}</td>
                    <td>${item.price} ج.م</td>
                    <td>${item.price * item.quantity} ج.م</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div className="totals">
              <div className="total-row">
                <span>الإجمالي الفرعي:</span>
                <span>${order.subTotal} ج.م</span>
              </div>
              <div className="total-row">
                <span>مصاريف التوصيل:</span>
                <span>${order.deliveryPrice} ج.م</span>
              </div>
              <div className="total-row final-total">
                <span>الإجمالي الكلي:</span>
                <span>${order.totalAmount} ج.م</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
      windowPrint.document.close();
      // تأخير بسيط لضمان تحميل المحتوى قبل فتح نافذة الطباعة
      setTimeout(() => {
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
      }, 250);
    }
  };

  const handleDelete = () => {
    if (confirm(`هل أنت متأكد من حذف الطلب #${order.orderNumber}؟`)) {
      deleteOrder(order.orderNumber);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle
            className="flex justify-between items-center text-right"
            dir="rtl"
          >
            <span className="flex items-center gap-2">
              <Package className="text-indigo-600" /> تفاصيل الطلب #
              {order.orderNumber}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="ml-2 h-4 w-4" /> طباعة الفاتورة
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                {isDeleting ? "جاري الحذف..." : "حذف الطلب"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6 text-right" dir="rtl">
          {/* تغيير الحالة */}
          <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-bold">حالة الطلب الحالية:</span>
            </div>
            <Select
              defaultValue={order.status}
              onValueChange={(value) =>
                updateStatus({ orderNumber: order.orderNumber, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="تغيير الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="معلق">معلق</SelectItem>
                <SelectItem value="يتم التحضير">يتم التحضير</SelectItem>{" "}
                {/* مطابقة للباك إند */}
                <SelectItem value="خرج للتوصيل">خرج للتوصيل</SelectItem>
                <SelectItem value="وصل">وصل</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* محتوى الفاتورة (الجزء القابل للطباعة) */}
          <div ref={printRef} className="space-y-4 p-2">
            <div className="hidden print:block header">
              <h2>FastOrder</h2>
              <p>طلب رقم: ${order.orderNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-slate-500 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> العميل
                </p>
                <p className="font-bold">{order.customerName}</p>
                <p className="text-slate-600">{order.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> العنوان
                </p>
                <p className="font-bold">{order.area}</p>
                <p className="text-slate-600 line-clamp-2">{order.address}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-2 text-right">الصنف</th>
                    <th className="p-2 text-center">الكمية</th>
                    <th className="p-2 text-left">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="p-2 text-left">
                        {item.price * item.quantity} ج.م 0
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">الإجمالي الفرعي:</span>
                <span>{order.subTotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  مصاريف التوصيل ({order.area}):
                </span>
                <span>{order.deliveryPrice} ج.م</span>
              </div>
              <div className="flex justify-between text-lg font-black text-indigo-700 border-t pt-2">
                <span>الإجمالي النهائي:</span>
                <span>{order.totalAmount} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
