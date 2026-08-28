import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const URL = import.meta.env.VITE_API_URL;

const editProfile = async ({ bio, profilepic }) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("bio", bio);

  if (profilepic) {
    formData.append("profilepic", profilepic);
  }

  const response = await axios.put(
    `${URL}/profile/edit`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProfile,

    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully");

      // Refresh dashboard/profile information
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data || "Failed to update profile"
      );
    },
  });
};