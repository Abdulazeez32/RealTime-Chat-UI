import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getGroupMembers = async (groupId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/group/details/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useGroupMembers = (groupId) => {
  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });
};