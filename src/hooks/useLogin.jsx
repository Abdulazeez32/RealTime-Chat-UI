import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../../config";
 
const loginUser = async (userData) => {
  const response = await axios.post(
    `${URL}/user/login`,
    userData
  );
 
  return response.data;
};
 
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
 
    onSuccess: (data) => {
      toast.success(data);
    },
 
    onError: (error) => {
      toast.error(
        error.response?.data || "Login Failed"
      );
    },
  });
};
 