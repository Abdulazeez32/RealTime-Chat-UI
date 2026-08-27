import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const acceptRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/connection/accept/${requestId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRequest,

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
        "Accept request failed:",
        error.response?.data || error.message
      );
    },
  });
};