export interface WorkoutPlanGeneratorInput {
  fitnessGoal: string;
  gender: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  workoutDurationMinutes: number;
  availableEquipment: string[];
  medicalConditions: string | null;
}

export interface WorkoutPrompt {
  systemPrompt: string;
  userPrompt: string;
}

const SYSTEM_PROMPT = `You are a certified fitness coach that designs safe, structured workout plans for gym members.
Respond with ONLY valid JSON, no markdown, no code fences, no commentary before or after — just the JSON object itself.
The JSON must exactly match this shape:
{
  "summary": string,
  "days": [
    { "day": string, "focus": string, "exercises": [ { "name": string, "sets": number, "reps": string } ] }
  ],
  "notes": string[]
}
Generate exactly the requested number of workout days. Keep exercises appropriate for the member's stated experience level and available equipment. If medical conditions are noted, include a caution about them in "notes" and avoid contraindicated movements where reasonably possible.`;

function buildUserPrompt(input: WorkoutPlanGeneratorInput): string {
  const lines = [
    `Fitness goal: ${input.fitnessGoal}`,
    `Experience level: ${input.experienceLevel}`,
    `Workout days per week: ${input.workoutDaysPerWeek}`,
    `Session duration: ${input.workoutDurationMinutes} minutes`,
  ];

  if (input.gender) lines.push(`Gender: ${input.gender}`);
  if (input.age !== null) lines.push(`Age: ${input.age}`);
  if (input.heightCm !== null) lines.push(`Height: ${input.heightCm} cm`);
  if (input.weightKg !== null) lines.push(`Weight: ${input.weightKg} kg`);
  lines.push(
    `Available equipment: ${
      input.availableEquipment.length > 0 ? input.availableEquipment.join(", ") : "none specified"
    }`,
  );
  if (input.medicalConditions) {
    lines.push(`Medical conditions to account for: ${input.medicalConditions}`);
  }

  return `Generate a workout plan for this gym member:\n${lines.join("\n")}`;
}

export function buildWorkoutPrompt(input: WorkoutPlanGeneratorInput): WorkoutPrompt {
  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(input),
  };
}
