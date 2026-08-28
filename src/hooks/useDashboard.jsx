import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

// ============================================================
// GET DASHBOARD DATA
// ============================================================

const getDashboard = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axios.get(
    `${URL}/profile/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ============================================================
// DASHBOARD HOOK
// ============================================================

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,

    enabled: !!localStorage.getItem("token"),

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};