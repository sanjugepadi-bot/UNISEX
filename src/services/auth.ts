import { createClient } from "@/lib/supabase/server";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

interface SignUpParams {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface SignUpResult {
  userId: string;
}

export async function signUp({
  fullName,
  email,
  phone,
  password,
}: SignUpParams): Promise<ServiceResult<SignUpResult>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data.user) {
      return {
        data: null,
        error: "Something went wrong creating your account. Please try again.",
      };
    }

    return { data: { userId: data.user.id }, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResult {
  userId: string;
}

function toFriendlySignInError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before logging in.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return "Something went wrong while logging in. Please try again.";
}

export async function signIn({
  email,
  password,
}: SignInParams): Promise<ServiceResult<SignInResult>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[signIn] Supabase error:", error.message);
      return { data: null, error: toFriendlySignInError(error.message) };
    }

    if (!data.user) {
      return {
        data: null,
        error: "Something went wrong while logging in. Please try again.",
      };
    }

    return { data: { userId: data.user.id }, error: null };
  } catch (err) {
    console.error("[signIn] Unexpected error:", err);
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}

export async function signOut(): Promise<ServiceResult<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

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
