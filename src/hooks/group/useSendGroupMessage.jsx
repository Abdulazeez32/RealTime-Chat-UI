import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const sendGroupMessage = async ({ groupid, text }) => {
  console.log("HOOK CALLED");
  console.log("Group ID:", groupid);
  console.log("Message:", text);

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axios.post(
    `${URL}/message/chat/${groupid}`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("MESSAGE API RESPONSE:", response.data);

  return response.data;
};

export const useSendGroupMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendGroupMessage,

    onSuccess: (data, variables) => {
      console.log("MESSAGE MUTATION SUCCESS:", data);

      queryClient.invalidateQueries({
        queryKey: ["group-messages", variables.groupid],
      });
    },

    onError: (error) => {
      console.error("MESSAGE MUTATION ERROR:", error);

      console.error(
        "Backend response:",
        error?.response?.data
      );

      console.error(
        "Status:",
        error?.response?.status
      );
    },
  });
};