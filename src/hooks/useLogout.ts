import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import { UserSateType } from '../context/AuthContext';

export function useLogout() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async function () {
    setIsPending(true);
    setError(null);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      const logoutUser = await fetch('http://localhost:3000/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!logoutUser.ok) {
        throw new Error(await logoutUser.json().then(data => data.message));
      }
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch({ type: UserSateType.LOGOUT, payload: null });
      setError(null);
      setIsPending(false);
      navigate('/login'); // Redirect to login after logout
    } catch (err: any) {
      console.error(err);
      setError(err);
      setIsPending(false);
    }
  };

  return { error, isPending, logout };
}
