import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const rejectGroupRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/group/request/reject/${requestId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useRejectGroupRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectGroupRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-groups"],
      });
    },
  });
};