import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getGroupDetails = async (groupId) => {
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

export const useGroupDetails = (groupId) => {
  return useQuery({
    queryKey: ["group-details", groupId],
    queryFn: () => getGroupDetails(groupId),
    enabled: !!groupId,
  });
};