import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";

export default async function Home() {
  const { data: profile } = await getCurrentUserProfile();
  redirect(profile ? "/dashboard" : "/login");
}
