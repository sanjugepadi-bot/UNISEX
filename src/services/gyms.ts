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
  gymPhone: string | null;
  gymEmail: string | null;
  address: string | null;
}

export async function getCurrentGym(gymId: string): Promise<ServiceResult<Gym>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gyms")
      .select("id, gym_name, gym_phone, gym_email, address")
      .eq("id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        id: data.id,
        gymName: data.gym_name,
        gymPhone: data.gym_phone,
        gymEmail: data.gym_email,
        address: data.address,
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

interface UpdateGymParams {
  gymId: string;
  gymName: string;
  gymPhone?: string;
  gymEmail?: string;
  address?: string;
}

export async function updateGym(params: UpdateGymParams): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("gyms")
      .update({
        gym_name: params.gymName,
        gym_phone: params.gymPhone ?? null,
        gym_email: params.gymEmail ?? null,
        address: params.address ?? null,
      })
      .eq("id", params.gymId);

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
