import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  gender: string | null;
  dateOfBirth: string | null;
  height: number | null;
  weight: number | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  createdAt: string;
}

function sanitizeSearchTerm(search: string): string {
  // Strip characters meaningful to PostgREST's .or() filter syntax and ILIKE wildcards
  return search.replace(/[,()%_]/g, "").trim();
}

interface GetMembersParams {
  gymId: string;
  search?: string;
}

export async function getMembers({
  gymId,
  search,
}: GetMembersParams): Promise<ServiceResult<Member[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("members")
      .select(
        "id, full_name, phone, gender, date_of_birth, height, weight, emergency_contact_name, emergency_contact_phone, membership_start_date, membership_end_date, created_at",
      )
      .eq("gym_id", gymId)
      .order("full_name", { ascending: true });

    const cleanSearch = search ? sanitizeSearchTerm(search) : "";
    if (cleanSearch) {
      query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: data.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        phone: row.phone,
        gender: row.gender,
        dateOfBirth: row.date_of_birth,
        height: row.height,
        weight: row.weight,
        emergencyContactName: row.emergency_contact_name,
        emergencyContactPhone: row.emergency_contact_phone,
        membershipStartDate: row.membership_start_date,
        membershipEndDate: row.membership_end_date,
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

interface CreateMemberParams {
  gymId: string;
  fullName: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  membershipStartDate: string;
  membershipEndDate: string;
}

export async function createMember(
  params: CreateMemberParams,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .insert({
        gym_id: params.gymId,
        full_name: params.fullName,
        phone: params.phone,
        gender: params.gender ?? null,
        date_of_birth: params.dateOfBirth ?? null,
        height: params.height ?? null,
        weight: params.weight ?? null,
        emergency_contact_name: params.emergencyContactName ?? null,
        emergency_contact_phone: params.emergencyContactPhone ?? null,
        membership_start_date: params.membershipStartDate,
        membership_end_date: params.membershipEndDate,
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

export async function getMemberById(
  id: string,
  gymId: string,
): Promise<ServiceResult<Member>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .select(
        "id, full_name, phone, gender, date_of_birth, height, weight, emergency_contact_name, emergency_contact_phone, membership_start_date, membership_end_date, created_at",
      )
      .eq("id", id)
      .eq("gym_id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        id: data.id,
        fullName: data.full_name,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.date_of_birth,
        height: data.height,
        weight: data.weight,
        emergencyContactName: data.emergency_contact_name,
        emergencyContactPhone: data.emergency_contact_phone,
        membershipStartDate: data.membership_start_date,
        membershipEndDate: data.membership_end_date,
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

interface UpdateMemberParams {
  id: string;
  gymId: string;
  fullName: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  membershipStartDate: string;
  membershipEndDate: string;
}

export async function updateMember(params: UpdateMemberParams): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("members")
      .update({
        full_name: params.fullName,
        phone: params.phone,
        gender: params.gender ?? null,
        date_of_birth: params.dateOfBirth ?? null,
        height: params.height ?? null,
        weight: params.weight ?? null,
        emergency_contact_name: params.emergencyContactName ?? null,
        emergency_contact_phone: params.emergencyContactPhone ?? null,
        membership_start_date: params.membershipStartDate,
        membership_end_date: params.membershipEndDate,
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

export async function deleteMember(id: string, gymId: string): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const { error, count } = await supabase
      .from("members")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("gym_id", gymId);

    if (error) {
      return { data: null, error: error.message };
    }

    if (!count) {
      return { data: null, error: "You don't have permission to delete this member." };
    }

    return { data: null, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
