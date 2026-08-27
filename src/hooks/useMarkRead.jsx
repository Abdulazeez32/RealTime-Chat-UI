import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const markMessagesRead = async (receiverId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/dmessage/read/${receiverId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unreadCount"],
      });
    },
  });
};