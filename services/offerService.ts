import api from "@/lib/axios";

export const getOffers = async () => {
  const { data } = await api.get("/offers");
  return data;
};

export const createOffer = async (offerData: FormData) => {
  const { data } = await api.post("/offers", offerData);
  return data;
};

export const deleteOffer = async (id: string) => {
  const { data } = await api.delete(`/offers/${id}`);
  return data;
};

export const updateOffer = async (id: string, offerData: FormData) => {
  const { data } = await api.put(`/offers/${id}`, offerData);
  return data;
};
