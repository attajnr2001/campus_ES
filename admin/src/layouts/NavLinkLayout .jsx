import "../styles/navLinkLayout.css";
import { Outlet, NavLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AccountBox } from "@mui/icons-material";

const NavLinkLayout = () => {
  return (
    <div className="container">
      <div className="links">
        <NavLink to="voters" className="navLink">
          <PersonIcon />
        </NavLink>

        <NavLink to="candidates" className="navLink">
          <AccountCircleIcon />
        </NavLink>

        <NavLink to="users" className="navLink">
          <AccountBox />
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default NavLinkLayout;
