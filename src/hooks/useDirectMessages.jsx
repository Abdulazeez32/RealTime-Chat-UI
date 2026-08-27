import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getDirectMessages = async (receiverId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/dmessage/getting/${receiverId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useDirectMessages = (receiverId) => {
  return useQuery({
    queryKey: ["directMessages", receiverId],
    queryFn: () => getDirectMessages(receiverId),
    enabled: !!receiverId,
    refetchOnWindowFocus: false,
  });
};