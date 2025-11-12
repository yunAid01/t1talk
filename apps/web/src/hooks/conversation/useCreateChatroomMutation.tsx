"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

//redux
import { useDispatch } from "react-redux";
import { closeModal } from "@/store/features/modalSlice";

//api
import { createChatRoom, createGroupChatRoom } from "@/api/chatroom";

export const useCreateChatRoomMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: (chatroomdata) => {
      console.log("채팅방 생성 성공");
      dispatch(closeModal());
      router.push(`/conversations/${chatroomdata.id}`);
    },
    onError: (error) => {
      console.error("채팅방 생성 실패", error);
    },
  });
};

export const useCreateGroupChatRoomMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: createGroupChatRoom,
    onSuccess: (chatroomdata) => {
      console.log("그룹 채팅방 생성 성공");
      dispatch(closeModal());
      router.push(`/conversations/${chatroomdata.id}`);
    },
    onError: (error) => {
      console.error("그룹 채팅방 생성 실패", error);
    },
  });
};
