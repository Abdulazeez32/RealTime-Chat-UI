import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getComments = async (postid) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${URL}/post/getcomments/${postid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useComments = (postid, enabled = false) => {
  return useQuery({
    queryKey: ["comments", postid],
    queryFn: () => getComments(postid),
    enabled: Boolean(postid) && enabled,
  });
};