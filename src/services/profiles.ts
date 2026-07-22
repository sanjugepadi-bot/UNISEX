import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface Profile {
  id: string;
  gymId: string | null;
  role: string;
  fullName: string | null;
}

export async function getCurrentUserProfile(): Promise<ServiceResult<Profile>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "You must be signed in to continue." };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, gym_id, role, full_name")
      .eq("id", user.id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        id: data.id,
        gymId: data.gym_id,
        role: data.role,
        fullName: data.full_name,
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
