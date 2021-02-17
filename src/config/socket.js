import { io } from "socket.io-client";
var socket;
socket = io("ws://api-pictionary.jaivardhansingh.tech/");
export default socket;
