import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const linkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 rounded-xl ${
      isActive
        ? "text-black bg-gray-100 shadow-sm"
        : "text-gray-500 hover:text-black hover:bg-gray-50"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center w-full px-6 py-4 text-lg font-bold transition-all ${
      isActive
        ? "text-black bg-gray-50 border-r-4 border-black"
        : "text-gray-500"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black">
              I
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">
              IPO<span className="text-gray-400">REC</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/home" className={linkClass}>Home</NavLink>
            <NavLink to="/all-person" className={linkClass}>All Person</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            <NavLink to="/register-person" className={linkClass}>Register Person</NavLink>
            <NavLink to="/register-ipo" className={linkClass}>Register IPO</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setOpen(true)}
          >
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-black"></div>
              <div className="w-4 h-0.5 bg-black"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-visibility duration-300 ${open ? "visible" : "invisible"}`}
      >
        {/* Dark Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Sidebar Content */}
        <div 
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out transform ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* Header in Sidebar */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <span className="font-black text-xl tracking-tighter">MENU</span>
              <button 
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 py-4">
              <NavLink to="/home" className={mobileLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/all-person" className={mobileLinkClass} onClick={() => setOpen(false)}>All Person</NavLink>
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
              <NavLink to="/register-person" className={mobileLinkClass} onClick={() => setOpen(false)}>Register Person</NavLink>
              <NavLink to="/register-ipo" className={mobileLinkClass} onClick={() => setOpen(false)}>Register IPO</NavLink>
            </div>

            {/* Footer in Sidebar */}
            <div className="p-8 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest text-center">
                © 2026 IPO Records v2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;