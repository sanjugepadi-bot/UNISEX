import { createClient } from "@/lib/supabase/server";
import {
  generateDietPlanContent,
  type DietPlanGeneratorInput,
  type DietPlanContent,
} from "@/lib/dietPlanGenerator";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface DietPlan {
  id: string;
  memberId: string;
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
  planContent: DietPlanContent;
  createdAt: string;
  updatedAt: string;
}

interface DietPlanRow {
  id: string;
  member_id: string;
  dietary_goal: string;
  dietary_preference: string;
  activity_level: string;
  gender: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  daily_calorie_target: number | null;
  meal_count: number;
  budget_preference: string | null;
  preferred_cuisine: string | null;
  disliked_foods: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  supplements: string | null;
  plan_content: DietPlanContent;
  created_at: string;
  updated_at: string;
}

const DIET_PLAN_SELECT =
  "id, member_id, dietary_goal, dietary_preference, activity_level, gender, age, height_cm, weight_kg, daily_calorie_target, meal_count, budget_preference, preferred_cuisine, disliked_foods, allergies, medical_conditions, supplements, plan_content, created_at, updated_at";

function mapDietPlanRow(row: DietPlanRow): DietPlan {
  return {
    id: row.id,
    memberId: row.member_id,
    dietaryGoal: row.dietary_goal,
    dietaryPreference: row.dietary_preference,
    activityLevel: row.activity_level,
    gender: row.gender,
    age: row.age,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    dailyCalorieTarget: row.daily_calorie_target,
    mealCount: row.meal_count,
    budgetPreference: row.budget_preference,
    preferredCuisine: row.preferred_cuisine,
    dislikedFoods: row.disliked_foods,
    allergies: row.allergies,
    medicalConditions: row.medical_conditions,
    supplements: row.supplements,
    planContent: row.plan_content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface CreateDietPlanParams {
  gymId: string;
  memberId: string;
  createdBy: string;
  dietaryGoal: string;
  dietaryPreference: string;
  activityLevel: string;
  gender: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  dailyCalorieTarget?: number;
  mealCount: number;
  budgetPreference?: string;
  preferredCuisine?: string;
  dislikedFoods?: string;
  allergies?: string;
  medicalConditions?: string;
  supplements?: string;
}

export async function createDietPlan(
  params: CreateDietPlanParams,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Belt-and-suspenders check: confirm the member actually belongs to
    // this gym before creating anything — mirrors createWorkoutPlan.
    const { data: memberCheck, error: memberCheckError } = await supabase
      .from("members")
      .select("id")
      .eq("id", params.memberId)
      .eq("gym_id", params.gymId)
      .maybeSingle();

    if (memberCheckError) {
      return { data: null, error: memberCheckError.message };
    }

    if (!memberCheck) {
      return { data: null, error: "This member does not belong to your gym." };
    }

    const generatorInput: DietPlanGeneratorInput = {
      dietaryGoal: params.dietaryGoal,
      dietaryPreference: params.dietaryPreference,
      activityLevel: params.activityLevel,
      gender: params.gender,
      age: params.age,
      heightCm: params.heightCm,
      weightKg: params.weightKg,
      dailyCalorieTarget: params.dailyCalorieTarget ?? null,
      mealCount: params.mealCount,
      budgetPreference: params.budgetPreference ?? null,
      preferredCuisine: params.preferredCuisine ?? null,
      dislikedFoods: params.dislikedFoods ?? null,
      allergies: params.allergies ?? null,
      medicalConditions: params.medicalConditions ?? null,
      supplements: params.supplements ?? null,
    };

    const planContent = await generateDietPlanContent(generatorInput);

    const { data, error } = await supabase
      .from("diet_plans")
      .insert({
        gym_id: params.gymId,
        member_id: params.memberId,
        created_by: params.createdBy,
        dietary_goal: params.dietaryGoal,
        dietary_preference: params.dietaryPreference,
        activity_level: params.activityLevel,
        gender: params.gender,
        age: params.age,
        height_cm: params.heightCm,
        weight_kg: params.weightKg,
        daily_calorie_target: params.dailyCalorieTarget ?? planContent.dailyCalorieTarget,
        meal_count: params.mealCount,
        budget_preference: params.budgetPreference ?? null,
        preferred_cuisine: params.preferredCuisine ?? null,
        disliked_foods: params.dislikedFoods ?? null,
        allergies: params.allergies ?? null,
        medical_conditions: params.medicalConditions ?? null,
        supplements: params.supplements ?? null,
        plan_content: planContent,
      })
      .select("id")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: { id: data.id }, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function getDietPlansForMember(
  memberId: string,
  gymId: string,
): Promise<ServiceResult<DietPlan[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("diet_plans")
      .select(DIET_PLAN_SELECT)
      .eq("member_id", memberId)
      .eq("gym_id", gymId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as unknown as DietPlanRow[]).map(mapDietPlanRow), error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function getDietPlanById(
  id: string,
  gymId: string,
): Promise<ServiceResult<DietPlan>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("diet_plans")
      .select(DIET_PLAN_SELECT)
      .eq("id", id)
      .eq("gym_id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapDietPlanRow(data as unknown as DietPlanRow), error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
