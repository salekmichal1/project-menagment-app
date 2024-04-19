import { NavLink } from 'react-router-dom';

import './Navbar.css';
export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar__logo">ManagMe</h2>
      <ul className="navbar__list">
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
