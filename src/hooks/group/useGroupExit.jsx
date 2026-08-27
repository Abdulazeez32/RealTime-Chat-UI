import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const exitGroup = async ({ groupId }) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/group/exit/${groupId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useGroupExit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exitGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group-details", variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-members", variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-groups"],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-requests"],
      });
    },
  });
};