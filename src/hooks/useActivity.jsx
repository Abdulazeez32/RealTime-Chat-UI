import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

// GET ACTIVITY
const getActivity = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${URL}/activity/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE ACTIVITY
const updateActivity = async (activityData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/activity/update`,
    activityData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// GET HOOK
export const useActivity = () => {
  return useQuery({
    queryKey: ["activity"],
    queryFn: getActivity,
    staleTime: 1000 * 60 * 5,
  });
};

// UPDATE HOOK
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateActivity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activity"],
      });
    },
  });
};