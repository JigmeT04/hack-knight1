
import React from 'react';
import { DumbbellIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-surface p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <DumbbellIcon className="w-8 h-8 text-brand-primary" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
          AI Workout Logger
        </h1>
      </div>
    </header>
  );
};

export default Header;
