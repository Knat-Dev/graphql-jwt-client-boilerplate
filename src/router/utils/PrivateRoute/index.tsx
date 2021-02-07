import React, { FC, useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { getSocket, useAuthContext, useSocketContext } from '../../../context';

export const PrivateRoute: FC<RouteProps> = (props) => {
  const [authState] = useAuthContext();
  const [socket, setSocket] = useSocketContext();

  useEffect(() => {
    if (!socket && authState.loggedIn) setSocket(getSocket());
    else if (!authState.loggedIn) {
      setSocket(null);
      socket?.disconnect();
    }
  }, [socket, authState, setSocket]);

  if (!authState.loggedIn) {
    const Component = () => <Redirect to="/login" />;
    return <Route {...props} component={Component} />;
  }
  return <Route {...props} />;
};
