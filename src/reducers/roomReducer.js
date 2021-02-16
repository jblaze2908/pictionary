let initialState = {
  roomId: "",
  players: [],
  currentBoard: [],
  chats: [],
  roundDetails: [],
  timer: 60,
  gameOver: false,
};
const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_ROOM_DETAILS":
      return action.payload;
    case "LEAVE_ROOM":
      return initialState;
    default:
      return state;
  }
};
export default roomReducer;
