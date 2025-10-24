import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon } from '@/components/icons/ThemeIcons';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `text-gray-600 dark:text-gray-300 hover:text-soft-blue-600 dark:hover:text-soft-blue-400 transition-colors ${
      isActive ? 'font-semibold text-soft-blue-700 dark:text-soft-blue-500' : ''
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              Boutique-Ku
            </NavLink>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Homepage
            </NavLink>
            <NavLink to="/tentang-kami" className={navLinkClass}>
              Tentang Kami
            </NavLink>
            <NavLink to="/kontak" className={navLinkClass}>
              Kontak
            </NavLink>
             <NavLink to="/admin/dashboard" className={navLinkClass}>
              Admin
            </NavLink>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-soft-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
