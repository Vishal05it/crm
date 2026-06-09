import { io } from "socket.io-client";
import { baseURL } from "../utils/baseURL";
let socket;
export const connectToSocket = async () => {
  let response = await fetch(`${baseURL}/socket-auth`);
  let socketData = await response.json();
  if (!socketData.success) throw new Error("Socket auth failed");
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
    auth: {
      token: socketData.socketToken,
    },
  });
  return socket;
};
export { socket };
