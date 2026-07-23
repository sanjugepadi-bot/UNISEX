import { createClient } from "@/lib/supabase/server";
import {
  generateWorkoutPlanContent,
  type WorkoutPlanGeneratorInput,
  type WorkoutPlanContent,
} from "@/lib/workoutPlanGenerator";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
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
  planContent: WorkoutPlanContent;
  createdAt: string;
  updatedAt: string;
}

interface WorkoutPlanRow {
  id: string;
  member_id: string;
  fitness_goal: string;
  gender: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  experience_level: string;
  workout_days_per_week: number;
  workout_duration_minutes: number;
  available_equipment: string[] | null;
  medical_conditions: string | null;
  plan_content: WorkoutPlanContent;
  created_at: string;
  updated_at: string;
}

const WORKOUT_PLAN_SELECT =
  "id, member_id, fitness_goal, gender, age, height_cm, weight_kg, experience_level, workout_days_per_week, workout_duration_minutes, available_equipment, medical_conditions, plan_content, created_at, updated_at";

function mapWorkoutPlanRow(row: WorkoutPlanRow): WorkoutPlan {
  return {
    id: row.id,
    memberId: row.member_id,
    fitnessGoal: row.fitness_goal,
    gender: row.gender,
    age: row.age,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    experienceLevel: row.experience_level,
    workoutDaysPerWeek: row.workout_days_per_week,
    workoutDurationMinutes: row.workout_duration_minutes,
    availableEquipment: row.available_equipment ?? [],
    medicalConditions: row.medical_conditions,
    planContent: row.plan_content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface CreateWorkoutPlanParams {
  gymId: string;
  memberId: string;
  createdBy: string;
  fitnessGoal: string;
  gender: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  workoutDurationMinutes: number;
  availableEquipment: string[];
  medicalConditions?: string;
}

export async function createWorkoutPlan(
  params: CreateWorkoutPlanParams,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Belt-and-suspenders check: confirm the member actually belongs to this
    // gym before creating anything. RLS on workout_plans only validates the
    // new row's own gym_id against the caller — it doesn't know or care
    // whether member_id points at a member in a different gym.
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

    const generatorInput: WorkoutPlanGeneratorInput = {
      fitnessGoal: params.fitnessGoal,
      gender: params.gender,
      age: params.age,
      heightCm: params.heightCm,
      weightKg: params.weightKg,
      experienceLevel: params.experienceLevel,
      workoutDaysPerWeek: params.workoutDaysPerWeek,
      workoutDurationMinutes: params.workoutDurationMinutes,
      availableEquipment: params.availableEquipment,
      medicalConditions: params.medicalConditions ?? null,
    };

    const planContent = await generateWorkoutPlanContent(generatorInput);

    const { data, error } = await supabase
      .from("workout_plans")
      .insert({
        gym_id: params.gymId,
        member_id: params.memberId,
        created_by: params.createdBy,
        fitness_goal: params.fitnessGoal,
        gender: params.gender,
        age: params.age,
        height_cm: params.heightCm,
        weight_kg: params.weightKg,
        experience_level: params.experienceLevel,
        workout_days_per_week: params.workoutDaysPerWeek,
        workout_duration_minutes: params.workoutDurationMinutes,
        available_equipment: params.availableEquipment,
        medical_conditions: params.medicalConditions ?? null,
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

export async function getWorkoutPlansForMember(
  memberId: string,
  gymId: string,
): Promise<ServiceResult<WorkoutPlan[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workout_plans")
      .select(WORKOUT_PLAN_SELECT)
      .eq("member_id", memberId)
      .eq("gym_id", gymId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as unknown as WorkoutPlanRow[]).map(mapWorkoutPlanRow), error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function getWorkoutPlanById(
  id: string,
  gymId: string,
): Promise<ServiceResult<WorkoutPlan>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workout_plans")
      .select(WORKOUT_PLAN_SELECT)
      .eq("id", id)
      .eq("gym_id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapWorkoutPlanRow(data as unknown as WorkoutPlanRow), error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
