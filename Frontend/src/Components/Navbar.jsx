import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      isActive
        ? "text-sky bg-whitepure/10"
        : "text-whitepure hover:text-sky"
    }`;

  return (
    <nav className="bg-navy px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <h1 className="text-xl font-semibold text-sky">
          IPO Records
        </h1>

        {/* Links */}
        <div className="flex items-center gap-4">
          <NavLink to="/home" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/all-person" className={linkClass}>
            All Person
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>

          <NavLink to="/register-person" className={linkClass}>
            Register Person
          </NavLink>

          <NavLink to="/register-ipo" className={linkClass}>
            Register IPO
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
