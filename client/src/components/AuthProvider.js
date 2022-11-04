import * as React from 'react';
import { checkAuth } from '../client';

import {AuthContext} from '../utils';

export default function AuthProvider({ children }) {
  let [isAuthenticated, setIsAuthenticated] = React.useState(false);
  let [activePassword, setActivePassword] = React.useState(false);

  let signin = (password, id) => {
    return new Promise((resolve, reject) => {
      checkAuth(password, id)
      .then(() => {
        setIsAuthenticated(true);
        setActivePassword(password);
        resolve();
      })
      .catch(reject)
    });
  };

  let signout = () => {
    setIsAuthenticated(false);
    setActivePassword();
    return Promise.resolve();
  };

  let value = { isAuthenticated, password: activePassword, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}