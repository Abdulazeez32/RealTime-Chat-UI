import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../../config";

const createProfile = async (formData) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${URL}/profile/create`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: createProfile,
  });
};

