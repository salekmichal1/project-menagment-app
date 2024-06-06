import { Dispatch, createContext, useEffect, useReducer } from 'react';
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
  user: null,
  authIsReady: false,
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

  useEffect(() => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken !== null) {
      const findUserByToken = async function () {
        try {
          console.log(refreshToken);

          const loginUser = await fetch('http://localhost:3000/refreshToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          if (!loginUser.ok) {
            dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
            throw new Error(await loginUser.json().then(data => data.message));
          }

          const loginUserData = await loginUser.json();
          sessionStorage.setItem('token', loginUserData.token);
          sessionStorage.setItem('refreshToken', loginUserData.refreshToken);
          console.log(
            loginUserData.token,
            loginUserData.refreshToken,
            loginUserData.user
          );

          // if (user) {
          //   dispatch({ type: UserSateType.AUTH_IS_READY, payload: user });
          // }
        } catch (err: any) {
          console.error(err.message);
        }
      };

      findUserByToken();
    } else {
      dispatch({ type: UserSateType.AUTH_IS_READY, payload: null });
    }
  }, []);

  console.log(state);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
