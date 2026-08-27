import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getPendingRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/connection/pending`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const usePendingRequests = () => {
  return useQuery({
    queryKey: ["pendingRequests"],
    queryFn: getPendingRequests,
    refetchOnWindowFocus: false,
  });
};