import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import { UserSateType } from '../context/AuthContext';

export function useLogin() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async function (username: string, password: string) {
    setIsPending(true);
    setError(null);
    try {
      const loginUser = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!loginUser.ok) {
        throw new Error(await loginUser.json().then(data => data.message));
      }
      const loginUserData = await loginUser.json();
      dispatch({ type: UserSateType.LOGIN, payload: loginUserData.user });
      sessionStorage.setItem('token', loginUserData.token);
      sessionStorage.setItem('refreshToken', loginUserData.refreshToken);
      console.log(
        loginUserData.token,
        loginUserData.refreshToken,
        loginUserData.user
      );
      setError(null);
      setIsPending(false);
    } catch (err: any) {
      console.error(err);
      setError(err);
      setIsPending(false);
    }
  };

  return { error, isPending, login };
}
