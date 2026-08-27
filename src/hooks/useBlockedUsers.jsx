import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getBlockedUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/connection/blocked`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useBlockedUsers = () => {
  return useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });
};