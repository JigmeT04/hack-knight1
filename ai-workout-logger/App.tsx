import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getWorkoutRecommendation } from './services/geminiService';
import { Workout, WorkoutRecommendation as Recommendation, Goal, UserProfile } from './types';

import Header from './components/Header';
import WorkoutForm from './components/WorkoutForm';
import WorkoutRecommendation from './components/WorkoutRecommendation';
import WorkoutHistory from './components/WorkoutHistory';
import UserProfileForm from './components/UserProfileForm';
import BlacklistManager from './components/BlacklistManager';

const App: React.FC = () => {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [blacklist, setBlacklist] = useLocalStorage<string[]>('blacklist', []);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal>('Strength');

  const handleAddWorkouts = (newWorkouts: Omit<Workout, 'id' | 'date'>[]) => {
    const timestamp = new Date().toISOString();
    const workoutsWithDetails: Workout[] = newWorkouts.map(workout => ({
      ...workout,
      id: crypto.randomUUID(),
      date: timestamp,
    }));
    setWorkouts(prevWorkouts => [...prevWorkouts, ...workoutsWithDetails]);
  };

  const handleGetRecommendation = async () => {
    if (!userProfile) {
      setError('Please fill out your profile to get a personalized recommendation.');
      return;
    }
    if (workouts.length === 0) {
      setError('Please log at least one workout to get a recommendation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await getWorkoutRecommendation(workouts, goal, userProfile, blacklist);
      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col space-y-8">
            <UserProfileForm profile={userProfile} onSave={setUserProfile} />
            <BlacklistManager blacklist={blacklist} onUpdateBlacklist={setBlacklist} />
            <WorkoutForm onAddWorkouts={handleAddWorkouts} />
            <WorkoutRecommendation
              onGetRecommendation={handleGetRecommendation}
              recommendation={recommendation}
              isLoading={isLoading}
              error={error}
              hasWorkouts={workouts.length > 0}
              hasProfile={!!userProfile}
              goal={goal}
              onSetGoal={setGoal}
            />
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3">
            <WorkoutHistory workouts={workouts} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;