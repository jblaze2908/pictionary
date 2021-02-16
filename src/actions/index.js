const loadRoomDetails = (data) => {
  return { type: "LOAD_ROOM_DETAILS", payload: data };
};
const leaveRoom = () => {
  return { type: "LEAVE_ROOM" };
};

export { loadRoomDetails, leaveRoom };
