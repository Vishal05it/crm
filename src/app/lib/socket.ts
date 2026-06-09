import { io } from "socket.io-client";
import { baseURL } from "../utils/baseURL";
let socket;
export const connectToSocket = async () => {
  console.log(`Connecting Socket...`);
  let response = await fetch(`${baseURL}/socket-auth`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let socketData = await response.json();
  console.log("Socket Data : ", socketData);
  if (!socketData.success) throw new Error("Socket auth failed");
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
    auth: {
      token: socketData.socketToken,
    },
  });
  // if (socket?.io?.opts?.auth) {
  //   console.log(socket.io.opts?.auth);
  // }
  return socket;
};
export { socket };
