import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getGroupMessages = async (groupId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/message/getting/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useGroupMessages = (groupId) => {
  return useQuery({
    queryKey: ["group-messages", groupId],
    queryFn: () => getGroupMessages(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 30,
  });
};