import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, Plus, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { campaignRequestAPI } from '../../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  // Fetch pending requests count for admins
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (isAdmin()) {
        try {
          const response = await campaignRequestAPI.getAll('pending');
          setPendingRequestsCount(response.data.length);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      }
    };

    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleCreateProject = () => {
    if (!user) {
      alert('Please login to submit a campaign request.');
      navigate('/login');
      return;
    }
    navigate('/create');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center justify-center">
            <span className="text-xl font-bold gradient-text">FundRise</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 mx-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center justify-end space-x-4 flex-shrink-0">
            {/* Notification Bell for Admins */}
            {isAdmin() && (
              <Link
                to="/admin"
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Bell className="h-5 w-5" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Button */}
            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
              {user && (
                <span className="font-medium">{user.name}</span>
              )}
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 bg-white shadow-lg rounded-lg border border-gray-200 w-48 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {isAdmin() && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Campaign Button */}
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Campaign</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200 space-y-1">
                {user ? (
                  <>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleCreateProject}
                      className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-2 rounded-lg font-medium text-center"
                    >
                      Submit Campaign
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
