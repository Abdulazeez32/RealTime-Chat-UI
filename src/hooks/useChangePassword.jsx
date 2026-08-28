// hooks/useChangePassword.js

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const changePassword = async (passwordData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/profile/changepassword`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};