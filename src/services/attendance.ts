import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  membershipEndDate: string | null;
}

interface AttendanceRow {
  id: string;
  member_id: string;
  check_in_time: string;
  member: { full_name: string; membership_end_date: string | null } | null;
}

function startOfDayUtc(dateStr: string): string {
  return `${dateStr}T00:00:00.000Z`;
}

function startOfNextDayUtc(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString();
}

export async function getAttendanceForDate(
  date: string,
): Promise<ServiceResult<AttendanceRecord[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("attendance")
      .select("id, member_id, check_in_time, member:members(full_name, membership_end_date)")
      .gte("check_in_time", startOfDayUtc(date))
      .lt("check_in_time", startOfNextDayUtc(date))
      .order("check_in_time", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: (data as unknown as AttendanceRow[]).map((row) => ({
        id: row.id,
        memberId: row.member_id,
        memberName: row.member?.full_name ?? "Unknown",
        checkInTime: row.check_in_time,
        membershipEndDate: row.member?.membership_end_date ?? null,
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

export async function checkInMember(memberId: string): Promise<ServiceResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("attendance")
      .insert({ member_id: memberId })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { data: null, error: "This member has already checked in today." };
      }
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
