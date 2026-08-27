import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const createPost = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/post/create`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-posts"],
      });
    },
  });
};