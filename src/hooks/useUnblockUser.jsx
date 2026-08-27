import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const unblockUser = async (profileId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${URL}/connection/unblock/${profileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blockedUsers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
    },

    onError: (error) => {
      console.error(
        "Unblock user error:",
        error.response?.data || error.message
      );
    },
  });
};