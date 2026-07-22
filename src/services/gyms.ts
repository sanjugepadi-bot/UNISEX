import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

interface CreateGymForOwnerParams {
  gymName: string;
  ownerName: string;
  gymPhone?: string;
  gymEmail?: string;
  address?: string;
  logoUrl?: string;
}

interface CreateGymForOwnerResult {
  gymId: string;
}

export async function createGymForOwner({
  gymName,
  ownerName,
  gymPhone,
  gymEmail,
  address,
  logoUrl,
}: CreateGymForOwnerParams): Promise<ServiceResult<CreateGymForOwnerResult>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("create_gym_for_owner", {
      p_gym_name: gymName,
      p_owner_name: ownerName,
      p_gym_phone: gymPhone,
      p_gym_email: gymEmail,
      p_address: address,
      p_logo_url: logoUrl,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: { gymId: data as string }, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export interface Gym {
  id: string;
  gymName: string;
}

export async function getCurrentGym(gymId: string): Promise<ServiceResult<Gym>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gyms")
      .select("id, gym_name")
      .eq("id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: { id: data.id, gymName: data.gym_name },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
