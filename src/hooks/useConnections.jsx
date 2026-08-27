import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getConnections = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/connection/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useConnections = () => {
  return useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
    refetchOnWindowFocus: false,
  });
};