import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getGroupRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/group/invites`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useGroupRequests = () => {
  return useQuery({
    queryKey: ["group-requests"],
    queryFn: getGroupRequests,
    staleTime: 1000 * 30,
  });
};