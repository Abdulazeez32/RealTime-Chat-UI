import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getUnreadCount = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/dmessage/unread`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    refetchOnWindowFocus: false,
  });
};