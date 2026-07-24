import { createClient } from "@/lib/supabase/server";
import type { MemberStatus } from "@/lib/memberStatus";

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
  planId: string | null;
  planName: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  createdAt: string;
}

interface MemberRow {
  id: string;
  full_name: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  height: number | null;
  weight: number | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  plan_id: string | null;
  plan: { plan_name: string } | null;
  membership_start_date: string | null;
  membership_end_date: string | null;
  created_at: string;
}

const MEMBER_SELECT =
  "id, full_name, phone, gender, date_of_birth, height, weight, emergency_contact_name, emergency_contact_phone, plan_id, plan:membership_plans(plan_name), membership_start_date, membership_end_date, created_at";

function mapMemberRow(row: MemberRow): Member {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    height: row.height,
    weight: row.weight,
    emergencyContactName: row.emergency_contact_name,
    emergencyContactPhone: row.emergency_contact_phone,
    planId: row.plan_id,
    planName: row.plan?.plan_name ?? null,
    membershipStartDate: row.membership_start_date,
    membershipEndDate: row.membership_end_date,
    createdAt: row.created_at,
  };
}

function sanitizeSearchTerm(search: string): string {
  // Strip characters meaningful to PostgREST's .or() filter syntax and ILIKE wildcards
  return search.replace(/[,()%_]/g, "").trim();
}

interface GetMembersParams {
  gymId: string;
  search?: string;
  status?: MemberStatus;
  page?: number;
  pageSize?: number;
}

export interface GetMembersResult {
  members: Member[];
  totalCount: number;
}

export async function getMembers({
  gymId,
  search,
  status,
  page = 1,
  pageSize = 20,
}: GetMembersParams): Promise<ServiceResult<GetMembersResult>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("members")
      .select(MEMBER_SELECT, { count: "exact" })
      .eq("gym_id", gymId)
      .order("full_name", { ascending: true });

    const cleanSearch = search ? sanitizeSearchTerm(search) : "";
    if (cleanSearch) {
      query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%`);
    }

    // Status categorization mirrors lib/memberStatus.ts's getMemberStatus()
    // definition, translated into SQL so it composes correctly with
    // .range() pagination below — filtering after fetching a single page
    // would produce inconsistent page sizes and incorrect page counts.
    if (status) {
      const today = new Date().toISOString().slice(0, 10);
      const expiringThreshold = new Date();
      expiringThreshold.setUTCDate(expiringThreshold.getUTCDate() + 7);
      const expiringThresholdIso = expiringThreshold.toISOString().slice(0, 10);

      if (status === "unknown") {
        query = query.is("membership_end_date", null);
      } else if (status === "expired") {
        query = query.lt("membership_end_date", today);
      } else if (status === "expiring") {
        query = query
          .gte("membership_end_date", today)
          .lte("membership_end_date", expiringThresholdIso);
      } else if (status === "active") {
        query = query.gt("membership_end_date", expiringThresholdIso);
      }
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        members: (data as unknown as MemberRow[]).map(mapMemberRow),
        totalCount: count ?? 0,
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

export async function getMemberById(id: string, gymId: string): Promise<ServiceResult<Member>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .select(MEMBER_SELECT)
      .eq("id", id)
      .eq("gym_id", gymId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: mapMemberRow(data as unknown as MemberRow), error: null };
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
  planId?: string;
  membershipStartDate: string;
  membershipEndDate?: string;
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
        plan_id: params.planId ?? null,
        membership_start_date: params.membershipStartDate,
        membership_end_date: params.membershipEndDate ?? null,
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
  planId?: string;
  membershipStartDate: string;
  membershipEndDate?: string;
}

export async function updateMember(params: UpdateMemberParams): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();

    const updatePayload: Record<string, unknown> = {
      full_name: params.fullName,
      phone: params.phone,
      gender: params.gender ?? null,
      date_of_birth: params.dateOfBirth ?? null,
      height: params.height ?? null,
      weight: params.weight ?? null,
      emergency_contact_name: params.emergencyContactName ?? null,
      emergency_contact_phone: params.emergencyContactPhone ?? null,
      plan_id: params.planId ?? null,
      membership_start_date: params.membershipStartDate,
    };

    // Only touch membership_end_date when the caller actually computed one
    // (i.e. a plan was selected) — otherwise leave the existing value alone.
    if (params.membershipEndDate !== undefined) {
      updatePayload.membership_end_date = params.membershipEndDate;
    }

    const { error } = await supabase
      .from("members")
      .update(updatePayload)
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
