import { NavLink } from 'react-router-dom';

import './Navbar.css';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useThemeContext } from '../../hooks/useThemeContext';

interface ThemeContextType {
  toggleTheme: () => void;
  theme: string;
  toggleDarkMode: boolean;
}

export default function Navbar() {
  const { toggleTheme, theme, toggleDarkMode } =
    useThemeContext() as ThemeContextType;

  return (
    <nav className="navbar">
      <h2 className="navbar__logo">ManagMe</h2>
      <ul className="navbar__list">
        <li className="navbar__list-item">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={toggleDarkMode} onChange={toggleTheme} />
              }
              label="Dark Mode"
            />
          </FormGroup>
        </li>
        <li className="navbar__list-item">
          <NavLink className="navbar__list-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="navbar__list-item">
          <NavLink className="navbar__list-link" to="/projects">
            Projects
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
