export const QUERY_KEYS = {
  FRIENDS: {
    LIST_REQUEST: ['friendRequests'],
    ADD_REQUEST: ['sendFriendRequests'],
    LIST: ['myFriends'],
    DETAILS: (friendId: number) => ['userDetails', friendId],
  },
  NOTMYFRIENDS: {
    DETAILS: (userId: number) => ['notMyFriendDetails', userId],
    LIST: ['notMyFriends'],
  },
  CHAT_ROOMS: {
    LIST: ['myChatRooms'],
    DETAILS: (chatRoomId: number) => ['chatRooms', 'details', chatRoomId],
    MESSAGES: (chatRoomId: number) => ['chatRooms', 'messages', chatRoomId],
  },
  USER: {
    DETAILS: (userId: number) => ['userDetails', userId],
  },
  MYPROFILE: {
    DETAILS: ['myProfile'],
  },
  MESSAGE: {
    LIST: (chatRoomId: number) => ['messages', chatRoomId],
  },
};
