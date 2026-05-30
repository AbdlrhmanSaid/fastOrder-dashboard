import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import toast from "react-hot-toast";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم الإضافة");
    },
    onError: (error: any) => {
      console.error("Error adding product:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم التعديل");
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التعديل");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم الحذف");
    },
  });

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    addProduct: addMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isMutating:
      addMutation.isLoading ||
      updateMutation.isLoading ||
      deleteMutation.isLoading,
  };
};
