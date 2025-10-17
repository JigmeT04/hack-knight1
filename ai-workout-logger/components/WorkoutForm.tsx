import React, { useState } from 'react';
import { Workout } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

type NewWorkout = Omit<Workout, 'id' | 'date'>;

interface WorkoutFormProps {
  onAddWorkouts: (workouts: NewWorkout[]) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onAddWorkouts }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sessionWorkouts, setSessionWorkouts] = useState<NewWorkout[]>([]);

  const handleAddExerciseToSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise.trim() || !sets || !reps || !weight) {
      alert('Please fill in all exercise details to add it to the session.');
      return;
    }
    const newExercise: NewWorkout = {
      exercise: exercise.trim(),
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };
    setSessionWorkouts([...sessionWorkouts, newExercise]);
    // Reset fields
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setSessionWorkouts(sessionWorkouts.filter((_, index) => index !== indexToRemove));
  };
  
  const handleLogSession = () => {
    if (sessionWorkouts.length === 0) {
      alert('Please add at least one exercise to the session before logging.');
      return;
    }
    onAddWorkouts(sessionWorkouts);
    setSessionWorkouts([]);
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">Log a Session</h2>
      
      {/* Exercise Input Form */}
      <form onSubmit={handleAddExerciseToSession} className="space-y-4 border-b border-gray-700 pb-4 mb-4">
        <div>
          <label htmlFor="exercise" className="block text-sm font-medium text-dark-text-secondary mb-1">Exercise Name</label>
          <input
            type="text"
            id="exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g., Bench Press"
            className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="sets" className="block text-sm font-medium text-dark-text-secondary mb-1">Sets</label>
            <input type="number" id="sets" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="3" min="1" className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
          </div>
          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-dark-text-secondary mb-1">Reps</label>
            <input type="number" id="reps" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="10" min="1" className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-dark-text-secondary mb-1">Weight (kg)</label>
            <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="60" min="0" step="0.5" className="w-full bg-dark-surface border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition" />
          </div>
        </div>
        <button type="submit" className="w-full flex items-center justify-center bg-gray-600 text-dark-text-primary font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors duration-300">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Exercise to Session
        </button>
      </form>

      {/* Staged Exercises List */}
      <div className="space-y-3 mb-4">
        <h3 className="text-lg font-semibold text-dark-text-secondary">Current Session</h3>
        {sessionWorkouts.length === 0 ? (
          <p className="text-sm text-dark-text-secondary text-center py-2">No exercises added yet.</p>
        ) : (
          sessionWorkouts.map((workout, index) => (
            <div key={index} className="flex justify-between items-center bg-dark-surface p-3 rounded-md">
              <div>
                <p className="font-semibold text-dark-text-primary">{workout.exercise}</p>
                <p className="text-sm text-dark-text-secondary">{workout.sets}x{workout.reps} @ {workout.weight} kg</p>
              </div>
              <button onClick={() => handleRemoveExercise(index)} className="p-1 text-red-400 hover:text-red-300">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Log Session Button */}
      <button
        onClick={handleLogSession}
        disabled={sessionWorkouts.length === 0}
        className="w-full flex items-center justify-center bg-brand-primary text-dark-bg font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        Log Session ({sessionWorkouts.length} {sessionWorkouts.length === 1 ? 'Exercise' : 'Exercises'})
      </button>
    </div>
  );
};

export default WorkoutForm;
