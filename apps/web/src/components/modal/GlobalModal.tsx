'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, AppState } from '@/store/store';
import { closeModal } from '@/store/features/modalSlice';

// Modal components
// friends
import DeleteFriendConfirmModal from './friend-modal/DeleteFriendConfirmModal';
import FriendRequestAcceptConfirmModal from './friend-request-modal/FriendRequestAcceptConfirmModal';
import DeleteBlockConfirmModal from './friend-modal/DeleteBlockConfirmModal';
import CreateBlockConfirmModal from './friend-modal/CreateBlockConfirmModal';

// auth
import LogoutConfirmModal from './auth-modal/LogoutConfirmModal';

// user
import UserFindModal from './user-modal/UserFindModal';
import UserDetailModal from './user-modal/UserDetailModal';
import UpdateUserConfirmModal from './auth-modal/UpdateUserConfirmModal';
import DeleteUserConfirmModal from './auth-modal/DeleteUserConfirmModal';
import UpdatePasswordConfirmModal from './auth-modal/UpdatePasswordConfirmModal';
import NotMyUserDetailModal from './user-modal/NotMyUserDetailModal';

// chatroom
import CreateChatroomModal from './chatroom-modal/CreateChatroomModal';
import DeleteChatRoomConfirmModal from './chatroom-modal/DeleteChatRoomConfirmModal';

// message
import DeleteMessageConfirmModal from './message-modal/DeleteMessageConfirmModal';

// friend request
import SendFriendRequestConfirmModal from './friend-request-modal/SendFriendRequestConfirmModal';
import FindFriendRequestModal from './friend-request-modal/FindFriendRequestModal';
import DeleteFriendRequestConfirmModal from './friend-request-modal/DeleteFriendRequestConfirmModal';

// layout
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
    USER_UPDATE: UpdateUserConfirmModal,
    USER_DELETE: DeleteUserConfirmModal,
    PASSWORD_UPDATE: UpdatePasswordConfirmModal,

    // friend_request
    FIND_REQUEST: FindFriendRequestModal,
    FRIEND_REQUEST_SEND: SendFriendRequestConfirmModal,
    FRIEND_REQUEST_DELETE: DeleteFriendRequestConfirmModal,
    FRIEND_REQUEST_ACCEPT: FriendRequestAcceptConfirmModal, // 친구 요청 수락 & 거절

    // not my friend detail
    NOT_MY_FRIEND_DETAIL: NotMyUserDetailModal,

    // confirm
    LOGOUT_CONFIRM: LogoutConfirmModal,
    FRIEND_DELETE: DeleteFriendConfirmModal, // 친구 삭제
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
