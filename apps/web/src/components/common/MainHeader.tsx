// modal redux
import { openModal } from '@/store/features/modalSlice';
import { useDispatch } from 'react-redux';

interface MainHeaderProps {
  title: string;
  text: string;
}
export default function MainHeader({ title, text }: MainHeaderProps) {
  const dispatch = useDispatch();
  const handleOpenFindUserModal = () => {
    dispatch(openModal({ modalType: 'USER_FIND' }));
  };

  const handleOpenCreateChatroomModal = () => {
    dispatch(openModal({ modalType: 'CREATE_CHATROOM' }));
  };

  return (
    <div className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{text}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105"
              onClick={() => handleOpenFindUserModal()}
            >
              + ADD FRIEND
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105"
              onClick={() => handleOpenCreateChatroomModal()}
            >
              + NEW CHAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function dispatch(arg0: {
  payload: { modalType: string; modalProps?: any };
  type: 'modal/openModal';
}) {
  throw new Error('Function not implemented.');
}
