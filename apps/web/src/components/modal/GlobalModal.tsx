'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, AppState } from '@/store/store';
import { closeModal } from '@/store/features/modalSlice';

// Modal components
// friends
import DeleteFriendConfirmModal from './confirm-modal/DeleteFriendConfirmModal';
import CreateFriendConfirmModal from './confirm-modal/CreateFriendConfirmModal';
import DeleteBlockConfirmModal from './confirm-modal/DeleteBlockConfirmModal';
import CreateBlockConfirmModal from './confirm-modal/CreateBlockConfirmModal';
// user
import UserFindModal from './user-modal/UserFindModal';
import UserDetailModal from './user-modal/UserDetailModal';
import LogoutConfirmModal from './confirm-modal/LogoutConfirmModal';
// chatroom
import CreateChatroomModal from './chatroom-modal/CreateChatroomModal';
import DeleteChatRoomConfirmModal from './confirm-modal/DeleteChatRoomConfirmModal';
// message
import DeleteMessageConfirmModal from './confirm-modal/DeleteMessageConfirmModal';
import ModalLayout from './ModalLayout';

export default function GlobalModal() {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, modalType, modalProps } = useSelector(
    (state: AppState) => state.modal,
  );

  // 열린 모달이 없으면 아무것도 렌더링하지 않음
  if (!isOpen || !modalType) {
    return null;
  }

  // 모달 컴포넌트 매핑
  const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    // user
    USER_FIND: UserFindModal,
    USER_DETAIL: UserDetailModal,

    // confirm
    LOGOUT_CONFIRM: LogoutConfirmModal,
    FRIEND_CREATE: CreateFriendConfirmModal,
    FRIEND_DELETE: DeleteFriendConfirmModal,
    MESSAGE_DELETE: DeleteMessageConfirmModal,
    BLOCK_CREATE: CreateBlockConfirmModal,
    BLOCK_DELETE: DeleteBlockConfirmModal,

    // chatroom
    CREATE_CHATROOM: CreateChatroomModal,
    CHATROOM_DELETE: DeleteChatRoomConfirmModal,
    DELETE_MESSAGE: DeleteMessageConfirmModal,
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
