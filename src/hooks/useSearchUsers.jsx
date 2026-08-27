import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const searchUsers = async (username) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/user/search?username=${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useSearchUsers = (username) => {
  return useQuery({
    queryKey: ["search-users", username],
    queryFn: () => searchUsers(username),
    enabled: username.trim().length > 0,
  });
};