import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const rejectRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/connection/reject/${requestId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
    },

    onError: (error) => {
      console.error(
        "Reject request failed:",
        error.response?.data || error.message
      );
    },
  });
};