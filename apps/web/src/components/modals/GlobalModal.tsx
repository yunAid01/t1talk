"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, AppState } from "@/store/store";

// Modal components
import ModalLayout from "./ModalLayout";
import { closeModal } from "@/store/features/modalSlice";
import UserFindModal from "./UserFindModal";
import UserDetailModal from "./UserDetailModal";
import LogoutConfirmModal from "./confirm/LogoutConfirmModal";
import DeleteFriendConfirmModal from "./confirm/DeleteFriendConfirmModal";
import CreateChatroomModal from "./CreateChatroomModal";
import CreateFriendConfirmModal from "./confirm/CreateFriendConfirmModal";
import DeleteMessageConfirmModal from "./confirm/DeleteMessageConfirmModal";
import DeleteChatRoomConfirmModal from "./confirm/DeleteChatRoomConfirmModal";

export default function GlobalModal() {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, modalType, modalProps } = useSelector(
    (state: AppState) => state.modal
  );

  // 열린 모달이 없으면 아무것도 렌더링하지 않음
  if (!isOpen || !modalType) {
    return null;
  }

  // 모달 컴포넌트 매핑
  const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    USER_FIND: UserFindModal,
    USER_DETAIL: UserDetailModal,
    LOGOUT_CONFIRM: LogoutConfirmModal,
    CREATE_CHATROOM: CreateChatroomModal,
    FRIEND_DELETE: DeleteFriendConfirmModal,
    FRIEND_CREATE: CreateFriendConfirmModal,
    MESSAGE_DELETE: DeleteMessageConfirmModal,
    CHATROOM_DELETE: DeleteChatRoomConfirmModal,
  };
  const SpecificModal = MODAL_COMPONENTS[modalType];
  if (!SpecificModal) {
    return null; // 렌더링할 모달이 없으면 닫음
  }

  // 모달 관련 핸들러
  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <ModalLayout onClose={handleClose} isOpen={isOpen}>
      <SpecificModal {...modalProps} />
    </ModalLayout>
  );
}
