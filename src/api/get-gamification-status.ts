import { api } from "@/lib/axios";

interface GamificationStatus {
  experience: number;
  level: number;
  totalExperienceForNextLevel: number;
  title: string;
}

export async function GetGamificationStatus() {
  const response = await api.get<GamificationStatus>("/gamification/status");
  return response.data;
}
