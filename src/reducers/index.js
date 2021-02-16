import { combineReducers } from "redux";
import RoomReducer from "./roomReducer";
const allReducers = combineReducers({
  room: RoomReducer,
});
export default allReducers;
