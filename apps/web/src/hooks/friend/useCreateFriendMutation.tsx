"use client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createFriend } from "@/api/friend";
import { useDispatch } from "react-redux";
import { closeModal } from "@/store/features/modalSlice";
import toast from "react-hot-toast";

export const useCreateFriendMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createFriend,
    onSuccess: () => {
      toast.success("Friend added successfully!");
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      queryClient.invalidateQueries({ queryKey: ["notMyFriends"] });
      dispatch(closeModal());
    },
    onError: (error) => {
      console.error("add friend failed", error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error("Failed to add friend");
    },
  });
};
