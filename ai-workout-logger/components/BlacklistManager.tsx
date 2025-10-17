import React, { useState } from 'react';
import { BanIcon, TrashIcon, PlusIcon } from './Icons';

interface BlacklistManagerProps {
  blacklist: string[];
  onUpdateBlacklist: (blacklist: string[]) => void;
}

const BlacklistManager: React.FC<BlacklistManagerProps> = ({ blacklist, onUpdateBlacklist }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedItem = newItem.trim();
    if (trimmedItem && !blacklist.some(item => item.toLowerCase() === trimmedItem.toLowerCase())) {
      onUpdateBlacklist([...blacklist, trimmedItem]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onUpdateBlacklist(blacklist.filter(item => item !== itemToRemove));
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <BanIcon className="w-6 h-6 mr-3 text-red-400" />
        <h2 className="text-xl font-semibold text-dark-text-primary">Exercise Blacklist</h2>
      </div>
      
      <form onSubmit={handleAddItem} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="e.g., Barbell Squats"
          className="flex-grow bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-red-500 text-white font-bold p-2 rounded-md hover:bg-red-600 transition-colors flex-shrink-0"
          aria-label="Add to blacklist"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-2">
        {blacklist.length === 0 ? (
          <p className="text-sm text-dark-text-secondary text-center py-2">No exercises blacklisted.</p>
        ) : (
          blacklist.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-dark-surface p-2 rounded-md">
              <span className="text-dark-text-primary">{item}</span>
              <button onClick={() => handleRemoveItem(item)} className="p-1 text-red-400 hover:text-red-300" aria-label={`Remove ${item} from blacklist`}>
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlacklistManager;
