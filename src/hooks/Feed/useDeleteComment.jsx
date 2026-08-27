import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const deleteComment = async (commentid) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${URL}/post/deletecomment/${commentid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
};