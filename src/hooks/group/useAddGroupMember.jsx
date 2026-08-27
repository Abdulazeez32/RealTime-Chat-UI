import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const sendGroupInvite = async ({
  groupId,
  receiverId,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${URL}/group/sendinvite/${groupId}/${receiverId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useAddGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendGroupInvite,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "connected-users",
          variables.groupId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-details", variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-requests"],
      });
    },
  });
};