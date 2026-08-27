import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const searchConnectedUsers = async ({
  groupId,
  username,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/group/searchconnecteduser/${groupId}`,
    {
      params: {
        username,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useSearchConnectedUsers = (
  groupId,
  username = ""
) => {
  return useQuery({
    queryKey: [
      "connected-users",
      groupId,
      username,
    ],
    queryFn: () =>
      searchConnectedUsers({
        groupId,
        username,
      }),
    enabled: !!groupId,
  });
};