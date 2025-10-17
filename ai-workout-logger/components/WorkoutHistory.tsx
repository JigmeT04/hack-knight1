
import React from 'react';
import { Workout } from '../types';

interface WorkoutHistoryProps {
  workouts: Workout[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts }) => {
  const sortedWorkouts = [...workouts].reverse();

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl h-full">
      <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">Workout History</h2>
      {workouts.length === 0 ? (
        <div className="flex items-center justify-center h-48 bg-dark-surface rounded-md">
          <p className="text-dark-text-secondary">No workouts logged yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {sortedWorkouts.map((workout) => (
            <div key={workout.id} className="bg-dark-surface p-4 rounded-md shadow-md transition-transform transform hover:scale-[1.02] hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-brand-primary">{workout.exercise}</h3>
                  <p className="text-sm text-dark-text-secondary">
                    {workout.sets} sets x {workout.reps} reps @ {workout.weight} kg
                  </p>
                </div>
                <p className="text-xs text-dark-text-secondary whitespace-nowrap">
                  {new Date(workout.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
