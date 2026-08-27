import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getMyGroups = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/group/mygroups`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["my-groups"],
    queryFn: getMyGroups,
    enabled: !!localStorage.getItem("token"),
  });
};