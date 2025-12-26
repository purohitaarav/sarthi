import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Package, Sparkles, Info } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/guidance', label: 'AI Guidance', icon: Sparkles, highlight: true },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/reflections', label: 'Reflections', icon: Package },
    { path: '/spiritual', label: 'Spiritual', icon: Sparkles },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Sarthi</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map(({ path, label, icon: Icon, highlight }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === path
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } ${highlight ? 'relative' : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                    {highlight && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spiritual-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-spiritual-gold"></span>
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Sarthi. Built with React, Express, and SQLite.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
