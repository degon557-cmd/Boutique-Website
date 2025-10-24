import React from 'react';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-gray-400 hover:text-soft-blue-500 transition-colors">
            <InstagramIcon className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-soft-blue-500 transition-colors">
            <WhatsAppIcon className="h-6 w-6" />
            <span className="sr-only">WhatsApp</span>
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Boutique-Ku. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
