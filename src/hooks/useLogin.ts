import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

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
        throw Error(loginUser.statusText);
      }
      const loginUserData = await loginUser.json();
      console.log(loginUserData.token, loginUserData.refreshToken);
    } catch (err: any) {
      console.error(err);
    }
  };

  return { error, isPending, login };
}
