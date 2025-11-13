export const QUERY_KEYS = {
  FRIENDS: {
    LIST: ['myFriends'],
    DETAILS: (friendId: number) => ['userDetails', friendId],
  },
  CHAT_ROOMS: {
    LIST: ['myChatRooms'],
    DETAILS: (chatRoomId: number) => ['chatRooms', 'details', chatRoomId],
    MESSAGES: (chatRoomId: number) => ['chatRooms', 'messages', chatRoomId],
  },
  USER: {
    DETAILS: (userId: number) => ['userDetails', userId],
  },
  MESSAGE: {
    LIST: (chatRoomId: number) => ['messages', chatRoomId],
  },
};
