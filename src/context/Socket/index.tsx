import React, { useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../../utils';
export const getSocket = () => {
  const token = getAccessToken(); // get jwt token from local storage or cookie
  if (token) {
    return io('ws://localhost:5000', {
      query: { token },
    });
  }
  return null;
};
export const SocketContext = React.createContext<
  [Socket | null, (socket: Socket | null) => void]
>([null, () => {}]);

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider: React.FC = (props) => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const defaultSocketContext: [Socket | null, typeof setSocketState] = [
    socketState,
    setSocketState,
  ];

  return (
    <SocketContext.Provider value={defaultSocketContext}>
      {props.children}
    </SocketContext.Provider>
  );
};
