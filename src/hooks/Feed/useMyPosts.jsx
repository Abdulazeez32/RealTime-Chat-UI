import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getMyPosts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/post/getmypost`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useMyPosts = () => {
  return useQuery({
    queryKey: ["my-posts"],
    queryFn: getMyPosts,
    enabled: !!localStorage.getItem("token"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};