import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, createArea, deleteArea } from "@/services/areaService";
import toast from "react-hot-toast";

export const useAreas = () => {
  const queryClient = useQueryClient();

  const areasQuery = useQuery({ queryKey: ["areas"], queryFn: getAreas });

  const addAreaMutation = useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("تم إضافة المنطقة بنجاح");
    },
  });

  const deleteAreaMutation = useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("تم حذف المنطقة");
    },
  });
  // const updateAreaMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: any }) =>
  //     updateArea(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["areas"] });
  //     toast.success("تم تحديث الحالة");
  //   },
  // });

  return {
    areas: areasQuery.data,
    isLoading: areasQuery.isLoading,
    addArea: addAreaMutation.mutate,
    deleteArea: deleteAreaMutation.mutate,
    isMutating: addAreaMutation.isLoading || deleteAreaMutation.isLoading,
    // updateArea: updateAreaMutation.mutate,
  };
};
