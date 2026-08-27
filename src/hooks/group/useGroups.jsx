import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const getMyGroups = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${URL}/group/mygroups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getGroupInvites = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${URL}/group/invites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const createGroup = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${URL}/group/new`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const acceptGroupInvite = async (inviteId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/group/accept/${inviteId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const rejectGroupInvite = async (inviteId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${URL}/group/reject/${inviteId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });
};

export const useGroupInvites = () => {
  return useQuery({
    queryKey: ["groupInvites"],
    queryFn: getGroupInvites,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myGroups"],
      });
    },
  });
};

export const useAcceptGroupInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptGroupInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupInvites"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myGroups"],
      });
    },
  });
};

export const useRejectGroupInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectGroupInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupInvites"],
      });
    },
  });
};