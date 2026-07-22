import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface MembershipPlan {
  id: string;
  planName: string;
  durationDays: number;
  price: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export async function getPlans(gymId: string): Promise<ServiceResult<MembershipPlan[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("membership_plans")
      .select("id, plan_name, duration_days, price, description, is_active, created_at")
      .eq("gym_id", gymId)
      .order("plan_name", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: data.map((row) => ({
        id: row.id,
        planName: row.plan_name,
        durationDays: row.duration_days,
        price: Number(row.price),
        description: row.description,
        isActive: row.is_active,
        createdAt: row.created_at,
      })),
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function getPlanById(
  id: string,
  gymId: string,
): Promise<ServiceResult<MembershipPlan>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("membership_plans")
      .select("id, plan_name, duration_days, price, description, is_active, created_at")
      .eq("id", id)
      .eq("gym_id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        id: data.id,
        planName: data.plan_name,
        durationDays: data.duration_days,
        price: Number(data.price),
        description: data.description,
        isActive: data.is_active,
        createdAt: data.created_at,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

interface CreatePlanParams {
  gymId: string;
  planName: string;
  durationDays: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export async function createPlan(
  params: CreatePlanParams,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("membership_plans")
      .insert({
        gym_id: params.gymId,
        plan_name: params.planName,
        duration_days: params.durationDays,
        price: params.price,
        description: params.description ?? null,
        is_active: params.isActive,
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

interface UpdatePlanParams {
  id: string;
  gymId: string;
  planName: string;
  durationDays: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export async function updatePlan(params: UpdatePlanParams): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("membership_plans")
      .update({
        plan_name: params.planName,
        duration_days: params.durationDays,
        price: params.price,
        description: params.description ?? null,
        is_active: params.isActive,
      })
      .eq("id", params.id)
      .eq("gym_id", params.gymId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function deletePlan(id: string, gymId: string): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const { error, count } = await supabase
      .from("membership_plans")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("gym_id", gymId);

    if (error) {
      return { data: null, error: error.message };
    }

    if (!count) {
      return { data: null, error: "You don't have permission to delete this plan." };
    }

    return { data: null, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
