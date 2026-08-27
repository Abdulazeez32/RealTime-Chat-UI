import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const addComment = async ({ postid, comment }) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/post/comment/${postid}`,
    {
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postid],
      });

      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
};