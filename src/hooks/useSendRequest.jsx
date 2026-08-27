import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const sendRequest = async (profileId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/connection/send/${profileId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["search-users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["pendingRequests"],
      });
    },
  });
};