import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOffers,
  createOffer,
  deleteOffer,
  updateOffer,
} from "@/services/offerService";
import toast from "react-hot-toast";

export const useOffers = () => {
  const queryClient = useQueryClient();

  const offersQuery = useQuery({ queryKey: ["offers"], queryFn: getOffers });

  const addMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم إضافة العرض بنجاح");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم حذف العرض");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم تحديث العرض بنجاح");
    },
    onError: () => {
      toast.error("فشل في تحديث العرض");
    },
  });

  return {
    offers: offersQuery.data,
    isLoading: offersQuery.isLoading,
    addOffer: addMutation.mutate,
    deleteOffer: deleteMutation.mutate,
    updateOffer: updateMutation.mutate,
    isMutating: addMutation.isLoading || deleteMutation.isLoading,
  };
};
