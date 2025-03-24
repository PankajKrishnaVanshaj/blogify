import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

// 1. Create and export the SocketContext
export const SocketContext = createContext();

// 2. Custom hook to access the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// 3. SocketProvider to manage socket lifecycle and provide it to children
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket only if user exists
    if (user) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
        query: { userId: user._id },
      });
      setSocket(newSocket);

      // Listen for online users
      newSocket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on unmount or when user changes
      return () => newSocket.close();
    } else {
      // Cleanup the socket if the user logs out
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]); // Only re-run the effect when `user` changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
