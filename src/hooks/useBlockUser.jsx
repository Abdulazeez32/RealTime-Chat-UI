import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const blockUser = async (profileId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/connection/blockuser/${profileId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blockedUsers"],
      });
    },
  });
};