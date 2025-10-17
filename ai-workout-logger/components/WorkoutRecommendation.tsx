import React from 'react';
import { WorkoutRecommendation as Recommendation, Goal } from '../types';
import { SparklesIcon } from './Icons';

interface WorkoutRecommendationProps {
  onGetRecommendation: () => void;
  recommendation: Recommendation | null;
  isLoading: boolean;
  error: string | null;
  hasWorkouts: boolean;
  hasProfile: boolean;
  goal: Goal;
  onSetGoal: (goal: Goal) => void;
}

const GoalButton: React.FC<{
  label: Goal;
  currentGoal: Goal;
  onClick: (goal: Goal) => void;
}> = ({ label, currentGoal, onClick }) => {
  const isActive = label === currentGoal;
  return (
    <button
      onClick={() => onClick(label)}
      className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-brand-primary text-dark-bg shadow-lg'
          : 'bg-dark-surface text-dark-text-secondary hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
};

const WorkoutRecommendation: React.FC<WorkoutRecommendationProps> = ({
  onGetRecommendation,
  recommendation,
  isLoading,
  error,
  hasWorkouts,
  hasProfile,
  goal,
  onSetGoal,
}) => {
  const getHelperText = () => {
    if (!hasProfile) {
      return "Complete your profile to get started.";
    }
    if (!hasWorkouts) {
      return "Log a workout first to get a recommendation.";
    }
    return null;
  }
  const helperText = getHelperText();

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">AI Coach</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">Select Your Goal:</label>
        <div className="flex space-x-2 bg-dark-bg p-1 rounded-lg">
          <GoalButton label="Strength" currentGoal={goal} onClick={onSetGoal} />
          <GoalButton label="Size" currentGoal={goal} onClick={onSetGoal} />
          <GoalButton label="Endurance" currentGoal={goal} onClick={onSetGoal} />
        </div>
      </div>
      
      <button
        onClick={onGetRecommendation}
        disabled={isLoading || !hasWorkouts || !hasProfile}
        className="w-full flex items-center justify-center bg-gradient-to-r from-brand-secondary to-brand-primary text-dark-bg font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Thinking...' : 'Get Recommendation'}
      </button>

      {helperText && (
         <p className="text-center text-sm text-yellow-400 mt-3">
            {helperText}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {recommendation && !isLoading && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="border-l-4 border-brand-primary pl-4">
            <h3 className="text-lg font-bold text-brand-primary">{recommendation.sessionTitle}</h3>
            <p className="text-sm text-dark-text-secondary italic">"{recommendation.commentary}"</p>
          </div>
          <div className="space-y-3">
            {recommendation.exercises.map((ex, index) => (
              <div key={index} className="bg-dark-surface p-3 rounded-md">
                <p className="font-semibold text-dark-text-primary">{ex.name}</p>
                <p className="text-sm text-dark-text-secondary">
                  {ex.sets} sets x {ex.reps} reps at {ex.weight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRecommendation;
