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

export interface WorkoutPlanExercise {
  name: string;
  sets: number;
  reps: string;
}

export interface WorkoutPlanDay {
  day: string;
  focus: string;
  exercises: WorkoutPlanExercise[];
}

export interface WorkoutPlanContent {
  summary: string;
  days: WorkoutPlanDay[];
  notes: string[];
}

const FOCUS_POOL: Record<string, WorkoutPlanExercise[]> = {
  "Full Body": [
    { name: "Squat", sets: 3, reps: "10-12" },
    { name: "Push-up", sets: 3, reps: "10-15" },
    { name: "Bent-over Row", sets: 3, reps: "10-12" },
    { name: "Plank", sets: 3, reps: "30-45 sec" },
  ],
  Upper: [
    { name: "Bench Press", sets: 4, reps: "8-10" },
    { name: "Lat Pulldown", sets: 4, reps: "8-10" },
    { name: "Shoulder Press", sets: 3, reps: "10-12" },
    { name: "Bicep Curl", sets: 3, reps: "10-12" },
  ],
  Lower: [
    { name: "Squat", sets: 4, reps: "8-10" },
    { name: "Romanian Deadlift", sets: 4, reps: "8-10" },
    { name: "Lunges", sets: 3, reps: "10-12 each leg" },
    { name: "Calf Raise", sets: 3, reps: "15-20" },
  ],
  Push: [
    { name: "Bench Press", sets: 4, reps: "8-10" },
    { name: "Overhead Press", sets: 3, reps: "8-10" },
    { name: "Tricep Dip", sets: 3, reps: "10-12" },
  ],
  Pull: [
    { name: "Deadlift", sets: 3, reps: "6-8" },
    { name: "Pull-up / Lat Pulldown", sets: 4, reps: "8-10" },
    { name: "Bicep Curl", sets: 3, reps: "10-12" },
  ],
  Legs: [
    { name: "Squat", sets: 4, reps: "8-10" },
    { name: "Leg Press", sets: 3, reps: "10-12" },
    { name: "Calf Raise", sets: 3, reps: "15-20" },
  ],
  Cardio: [
    { name: "Treadmill / Cycling", sets: 1, reps: "20-30 min" },
    { name: "Jump Rope", sets: 3, reps: "2 min" },
  ],
};

function focusSequenceForDays(days: number): string[] {
  if (days <= 2) return ["Full Body", "Full Body"].slice(0, days);
  if (days === 3) return ["Full Body", "Full Body", "Full Body"];
  if (days === 4) return ["Upper", "Lower", "Upper", "Lower"];
  return ["Push", "Pull", "Legs", "Upper", "Lower", "Cardio", "Full Body"].slice(0, days);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * PLACEHOLDER generator — deterministic templates with light shuffling,
 * no AI involved. This is the intended seam for a real AI provider next
 * milestone: callers only depend on the input/output shapes below, never
 * on how the content is produced internally.
 *
 * Declared async (even though nothing here awaits yet) so that swapping
 * this body for a real Claude/OpenAI call later never has to change this
 * function's signature — callers already await it.
 */
export async function generateWorkoutPlanContent(
  input: WorkoutPlanGeneratorInput,
): Promise<WorkoutPlanContent> {
  const focusSequence = focusSequenceForDays(input.workoutDaysPerWeek);

  const days: WorkoutPlanDay[] = focusSequence.map((focus, index) => ({
    day: `Day ${index + 1}`,
    focus,
    exercises: shuffle(FOCUS_POOL[focus] ?? FOCUS_POOL["Full Body"]),
  }));

  const notes: string[] = [
    `Goal: ${input.fitnessGoal}. Experience level: ${input.experienceLevel}.`,
    `Sessions target ~${input.workoutDurationMinutes} minutes each.`,
  ];

  if (input.availableEquipment.length > 0) {
    notes.push(`Equipment available: ${input.availableEquipment.join(", ")}.`);
  } else {
    notes.push("No equipment specified — exercises may need bodyweight substitutions.");
  }

  if (input.medicalConditions) {
    notes.push(
      `Medical conditions noted: ${input.medicalConditions}. Review with the member before starting.`,
    );
  }

  return {
    summary: `${input.workoutDaysPerWeek}-day ${input.fitnessGoal.toLowerCase()} plan for a ${input.experienceLevel.toLowerCase()} lifter.`,
    days,
    notes,
  };
}
