import api from "@/lib/axios";

export const getAreas = async () => {
  const { data } = await api.get("/areas");
  return data;
};

export const createArea = async (areaData: {
  name: string;
  deliveryPrice: number;
}) => {
  const { data } = await api.post("/areas", areaData);
  return data;
};

// export const updateArea = async (
//   id: string,
//   areaData: { name: string; deliveryPrice: number; isAvailable?: boolean },
// ) => {
//   const { data } = await api.put(`/areas/${id}`, areaData);
//   return data;
// };

export const deleteArea = async (id: string) => {
  const { data } = await api.delete(`/areas/${id}`);
  return data;
};
