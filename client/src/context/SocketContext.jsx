import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// 1. Create and export the SocketContext
export const SocketContext = createContext();

// 2. Custom hook to access the socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

// 3. SocketProvider to manage socket lifecycle and provide it to children
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:55555", {
      reconnectionAttempts: 5, // Retry connection on failure
      timeout: 10000, // Timeout if connection is not established
    });
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
