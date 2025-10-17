import { GoogleGenAI, Type } from "@google/genai";
import { Workout, WorkoutRecommendation, Goal, UserProfile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workoutRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    sessionTitle: {
      type: Type.STRING,
      description: "A catchy and motivating title for the workout session, e.g., 'Leg Day Powerhouse' or 'Upper Body Push Strength'."
    },
    commentary: {
      type: Type.STRING,
      description: "A brief, encouraging commentary explaining the focus of the workout and why it was chosen based on the user's history and goals."
    },
    exercises: {
      type: Type.ARRAY,
      description: "A list of exercises for the recommended workout session.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the exercise, e.g., 'Barbell Squat'." },
          sets: { type: Type.STRING, description: "The recommended number of sets, e.g., '3'." },
          reps: { type: Type.STRING, description: "The recommended number of repetitions per set, e.g., '8-12'." },
          weight: { 
            type: Type.STRING, 
            description: "The recommended starting weight. If a prediction can be made from past similar exercises, provide a specific weight in kg. If no relevant history exists for an exercise, prescribe a descriptive weight like 'Light', 'Moderate', or 'Challenging'. For bodyweight exercises, specify 'Bodyweight'."
          }
        },
        required: ['name', 'sets', 'reps', 'weight']
      }
    }
  },
  required: ['sessionTitle', 'commentary', 'exercises']
};


export const getWorkoutRecommendation = async (workouts: Workout[], goal: Goal, userProfile: UserProfile | null, exerciseBlacklist: string[]): Promise<WorkoutRecommendation> => {
  const model = 'gemini-2.5-flash';
  
  const userProfileContext = userProfile 
    ? `User Profile:
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height} cm
      - Body Weight: ${userProfile.weight} kg
      Use this data for additional context when creating a safe and effective recommendation.`
    : "User profile not provided.";

  const blacklistContext = exerciseBlacklist.length > 0
    ? `User's Exercise Blacklist:
       Please do NOT recommend any of the following exercises under any circumstances: ${JSON.stringify(exerciseBlacklist)}. The user has blacklisted these due to preference, injury, or lack of equipment.`
    : "The user has not blacklisted any exercises.";

  const prompt = `
    You are an expert personal trainer and workout programmer. Analyze the following workout history, user profile, and exercise blacklist provided as JSON strings. The history is ordered from oldest to newest workout.

    ${userProfileContext}

    ${blacklistContext}

    Workout History:
    ${JSON.stringify(workouts.slice(-20))}

    The user's primary fitness goal is: **${goal}**.

    Based on this history and the user's goal, create a new, single workout session recommendation for today.
    - If the goal is 'Strength', focus on compound movements with lower repetitions (e.g., 3-6 reps) and heavier weights.
    - If the goal is 'Size' (hypertrophy), focus on moderate repetitions (e.g., 8-12 reps) with challenging weights and controlled movements.
    - If the goal is 'Endurance', focus on higher repetitions (e.g., 15-20 reps) or circuits with shorter rest periods and lighter weights.
    
    Regarding weight recommendations:
    1.  First, try to predict a suitable starting weight in kilograms based on the user's previous performance on similar lifts. For example, if the user has done 'Barbell Squat' at 80kg, a recommendation for 'Goblet Squat' should have a reasonable, lighter starting weight.
    2.  **If and only if there is NO relevant exercise history to base a weight prediction on**, prescribe the weight in descriptive terms like 'Light', 'Moderate', 'Challenging', or for bodyweight exercises, 'Bodyweight'. Do not provide a specific number in this case.

    The recommendation should logically progress from the previous workouts, considering muscle groups worked, volume, and intensity. Avoid recommending exercises that were performed in the most recent session to allow for muscle recovery, unless it's a full-body routine.

    Provide the workout as a structured JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutRecommendationSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: WorkoutRecommendation = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error fetching workout recommendation:", error);
    throw new Error("Failed to get a recommendation from the AI. Please try again.");
  }
};