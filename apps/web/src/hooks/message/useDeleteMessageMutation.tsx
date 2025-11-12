import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "@/api/message";
import toast from "react-hot-toast";
import { MessageType } from "@repo/validation";

export const useDeleteMessageMutation = (chatRoomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onMutate: async (messageId: number) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["messages", chatRoomId] });

      // 이전 데이터 백업
      const previousMessages = queryClient.getQueryData<MessageType[]>([
        "messages",
        chatRoomId,
      ]);

      // Optimistic Update: 메시지를 삭제된 것으로 표시
      queryClient.setQueryData<MessageType[]>(
        ["messages", chatRoomId],
        (old) => {
          if (!old) return [];
          return old.map((msg) =>
            msg.id === messageId ? { ...msg, isDeleted: true } : msg
          );
        }
      );

      // 롤백을 위해 이전 데이터 반환
      return { previousMessages };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversationRooms"] });
      toast.success("메시지가 삭제되었습니다");
    },
    onError: (error, messageId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", chatRoomId],
          context.previousMessages
        );
      }
      console.error("delete message failed", error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error("메시지 삭제에 실패했습니다");
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ["messages", chatRoomId] });
    },
  });
};
