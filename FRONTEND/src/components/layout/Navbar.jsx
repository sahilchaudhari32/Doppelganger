import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Anvil, Scan, LayoutGrid, User, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0 rounded-none bg-[rgba(11,11,15,0.8)] px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative flex items-center justify-center w-8 h-8 group-hover:scale-110 transition-transform duration-300">
          <Anvil className="w-6 h-6 text-chrome-400 absolute bottom-0 opacity-80" />
          <Scissors className="w-5 h-5 text-neon-pink absolute top-0 -rotate-45" style={{ textShadow: '0 0 10px #FF2EA6' }} />
        </div>
        <span className="font-orbitron font-bold text-xl tracking-wider chrome-text">
          STYLEFORGE
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 font-space text-sm uppercase tracking-widest text-chrome-400">
        <Link to="/dashboard" className="hover:text-neon-cyan transition-colors duration-300 flex items-center gap-1">
          <HomeIcon className="w-4 h-4" /> Hub
        </Link>
        <Link to="/analyze" className="hover:text-neon-cyan transition-colors duration-300 flex items-center gap-1">
          <Scan className="w-4 h-4" /> Create
        </Link>
        <Link to="/community" className="hover:text-neon-cyan transition-colors duration-300 flex items-center gap-1">
          <LayoutGrid className="w-4 h-4" /> Community
        </Link>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/profile')} className="chrome-button text-xs py-2 px-4 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <User className="w-4 h-4 inline-block mr-2" />
          Profile
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
