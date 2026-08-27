import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const acceptGroupRequest = async (requestId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/group/request/accept/${requestId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useAcceptGroupRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptGroupRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-groups"],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
};