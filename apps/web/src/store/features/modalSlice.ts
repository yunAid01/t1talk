import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean; // 모달이 열려있는지?
  modalType: string | null; // 어떤 종류의 모달인지? (예: 'USER_PROFILE', 'SETTINGS')
  modalProps?: any; // 모달에 전달할 추가적인 속성들
}
// 2. 모달의 초기 상태
const initialState: ModalState = {
  isOpen: false,
  modalType: null, // USER_PROFILE, SETTINGS 등
  modalProps: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modalType: string; modalProps?: any }>
    ) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps;
    },

    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = undefined;
    },
  },
});

export default modalSlice.reducer;

//action
export const { openModal, closeModal } = modalSlice.actions;
