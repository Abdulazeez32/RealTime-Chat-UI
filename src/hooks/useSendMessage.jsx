import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const sendMessage = async ({ receiverid, text }) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/dmessage/sending/${receiverid}`,
    {
      text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["directMessages", variables.receiverid],
      });

      queryClient.invalidateQueries({
        queryKey: ["chatList"],
      });

      queryClient.invalidateQueries({
        queryKey: ["unreadCount"],
      });
    },
  });
};