import React, { useState, useEffect } from 'react';
import { UserProfile, Gender } from '../types';
import { UserIcon } from './Icons';

interface UserProfileFormProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ profile, onSave }) => {
  const [age, setAge] = useState(profile?.age.toString() || '');
  const [height, setHeight] = useState(profile?.height.toString() || '');
  const [weight, setWeight] = useState(profile?.weight.toString() || '');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'Prefer not to say');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setAge(profile.age.toString());
      setHeight(profile.height.toString());
      setWeight(profile.weight.toString());
      setGender(profile.gender);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !height || !weight || !gender) {
      alert('Please fill in all profile fields.');
      return;
    }
    onSave({
      age: parseInt(age, 10),
      height: parseInt(height, 10),
      weight: parseFloat(weight),
      gender: gender,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide message after 2 seconds
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <UserIcon className="w-6 h-6 mr-3 text-brand-secondary" />
        <h2 className="text-xl font-semibold text-dark-text-primary">Your Profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-dark-text-secondary mb-1">Age</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              min="1"
              className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-dark-text-secondary mb-1">Height (cm)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="180"
              min="1"
              className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="bodyweight" className="block text-sm font-medium text-dark-text-secondary mb-1">Weight (kg)</label>
            <input
              type="number"
              id="bodyweight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="75"
              min="0"
              step="0.1"
              className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-dark-text-secondary mb-1">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-brand-secondary text-dark-bg font-bold py-2 px-4 rounded-md hover:bg-brand-primary transition-colors duration-300 transform hover:scale-105"
        >
          {isSaved ? 'Profile Saved!' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
