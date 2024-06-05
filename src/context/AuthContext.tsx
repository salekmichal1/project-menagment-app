import { Dispatch, createContext, useReducer } from 'react';
import { User } from '../model/User';

export enum UserSateType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  AUTH_IS_READY = 'AUTH_IS_READY',
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type UserActions = {
  type: UserSateType;
  payload: User | null;
};

type InitialState = {
  user: User | null;
  authIsReady: boolean;
};

const initialState: InitialState = {
  user: {
    id: '1',
    name: 'Michal',
    surname: 'Salek',
    userName: 'mictes',
    position: 'developer',
  },
  authIsReady: true,
};

export const AuthContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<UserActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const authReducer = function (state: InitialState, action: UserActions) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = function ({
  children,
}: AuthContextProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  console.log(state);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
