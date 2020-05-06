import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

import { strJwtToken } from '../util/utl'

const Action = {
  login: 1,
  logout: 2,
}

const initialState = {
  user: null
};

if (localStorage.getItem(strJwtToken)) {
  const decodedToken = jwtDecode(localStorage.getItem(strJwtToken));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem(strJwtToken);
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

// Redux/Reducer
function authReducer(state, action) {
  switch (action.type) {
    case Action.login:
      return {
        // splead existing state
        ...state,
        user: action.payload
      };
    case Action.logout:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem(strJwtToken, userData.token);
    dispatch({
      type: Action.login,
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem(strJwtToken);
    dispatch({ type: Action.logout });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
