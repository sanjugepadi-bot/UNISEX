export interface DietPlanGeneratorInput {
  dietaryGoal: string;
  dietaryPreference: string;
  activityLevel: string;
  gender: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  dailyCalorieTarget: number | null;
  mealCount: number;
  budgetPreference: string | null;
  preferredCuisine: string | null;
  dislikedFoods: string | null;
  allergies: string | null;
  medicalConditions: string | null;
  supplements: string | null;
}

export interface DietPrompt {
  systemPrompt: string;
  userPrompt: string;
}

const SYSTEM_PROMPT = `You are a certified nutrition coach specializing in diet plans for members of Indian gyms, with strong expertise in Indian food culture, regional cuisines, and commonly available ingredients across India.

Default to Indian meals and ingredients (e.g. dal, roti/chapati, rice, sabzi, paneer, curd/dahi, idli, dosa, poha, upma, sprouts, besan, millets like ragi/bajra/jowar) unless the member has specified a different preferred cuisine — if they have, prioritize that instead.

Important — dietary preference definitions, follow these strictly:
- "Vegetarian" means lacto-vegetarian: no meat, fish, or eggs. Dairy (milk, curd, paneer, ghee) is allowed. Do not include eggs for a Vegetarian member even if other cuisines commonly consider eggs vegetarian.
- "Eggetarian" means vegetarian plus eggs are allowed.
- "Vegan" excludes all animal products, including dairy and eggs.
- "Non-vegetarian" allows meat, fish, and eggs.

Keep budget preference realistic for the Indian context: "Budget" should favor accessible staples (dal, rice, seasonal vegetables, eggs where allowed) over expensive imported items; "Premium" can include items like paneer, nuts, whey protein, or fish more liberally.

Respond with ONLY valid JSON, no markdown, no code fences, no commentary before or after — just the JSON object itself.
The JSON must exactly match this shape:
{
  "summary": string,
  "dailyCalorieTarget": number,
  "days": [
    {
      "day": string,
      "meals": [
        { "name": string, "description": string, "calories": number, "protein": number, "carbs": number, "fat": number }
      ]
    }
  ],
  "notes": string[]
}
Generate exactly 7 days. Each day must have exactly the requested number of meals. Respect the dietary preference definitions above strictly. Avoid disliked foods and allergens entirely. If medical conditions are noted, include a caution about them in "notes" and adjust recommendations conservatively. If no calorie target was given, suggest an appropriate one based on the member's stats and goal, and use that as "dailyCalorieTarget".`;

function buildUserPrompt(input: DietPlanGeneratorInput): string {
  const lines = [
    `Dietary goal: ${input.dietaryGoal}`,
    `Dietary preference: ${input.dietaryPreference}`,
    `Activity level: ${input.activityLevel}`,
    `Meals per day: ${input.mealCount}`,
  ];

  if (input.gender) lines.push(`Gender: ${input.gender}`);
  if (input.age !== null) lines.push(`Age: ${input.age}`);
  if (input.heightCm !== null) lines.push(`Height: ${input.heightCm} cm`);
  if (input.weightKg !== null) lines.push(`Weight: ${input.weightKg} kg`);
  if (input.dailyCalorieTarget !== null) {
    lines.push(`Target daily calories: ${input.dailyCalorieTarget}`);
  } else {
    lines.push("Target daily calories: not specified — suggest an appropriate value");
  }
  if (input.budgetPreference) lines.push(`Budget preference: ${input.budgetPreference}`);
  if (input.preferredCuisine) {
    lines.push(`Preferred cuisine: ${input.preferredCuisine}`);
  } else {
    lines.push("Preferred cuisine: not specified — default to Indian cuisine and regional staples");
  }
  if (input.dislikedFoods) lines.push(`Disliked foods to avoid: ${input.dislikedFoods}`);
  if (input.allergies) lines.push(`Allergies to avoid: ${input.allergies}`);
  if (input.medicalConditions) {
    lines.push(`Medical conditions to account for: ${input.medicalConditions}`);
  }
  if (input.supplements) lines.push(`Current supplements: ${input.supplements}`);

  return `Generate a 7-day diet plan for this gym member:\n${lines.join("\n")}`;
}

export function buildDietPrompt(input: DietPlanGeneratorInput): DietPrompt {
  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(input),
  };
}
