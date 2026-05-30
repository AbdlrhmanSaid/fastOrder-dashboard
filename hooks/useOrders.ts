import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  deleteAllOrders,
} from "@/services/orderService";
import toast from "react-hot-toast";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  const statusMutation = useMutation({
    mutationFn: ({
      orderNumber,
      status,
    }: {
      orderNumber: string;
      status: string;
    }) => updateOrderStatus(orderNumber, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم تحديث الحالة بنجاح");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderNumber: string) => deleteOrder(orderNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: () => {
      toast.error("فشل حذف الطلب");
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم حذف جميع الطلبات بنجاح");
    },
    onError: () => {
      toast.error("فشل حذف الطلبات");
    },
  });

  return {
    orders: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    updateStatus: statusMutation.mutate,
    isUpdating: statusMutation.isLoading,
    deleteOrder: deleteMutation.mutate,
    isDeleting: deleteMutation.isLoading,
    deleteAllOrders: deleteAllMutation.mutate,
    isDeletingAll: deleteAllMutation.isLoading,
  };
};
