import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useThemeContext = function () {
  // reading auth context
  const context = useContext(ThemeContext);

  // chcek if auth context is not out of the scope
  if (!context) {
    throw Error('useAuthContext must be inside AuthContextProvider');
  }

  return context;
};
