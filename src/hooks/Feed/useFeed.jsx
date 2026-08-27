import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getFeed = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${URL}/post/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: getFeed,
    staleTime: 1000 * 60,
  });
};