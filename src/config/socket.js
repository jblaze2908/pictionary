import { io } from "socket.io-client";
var socket;
socket = io("ws://api-pictionary.jaivardhansingh.tech/");
// socket = io("ws://localhost:4000/");
export default socket;
