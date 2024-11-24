import { api } from "@/lib/axios";

interface UserProps {
  name: string;
  email: string;
  experience: number;
  created_at: string;
}

interface GetProfileResponse {
  user: UserProps;
}

export async function GetProfile() {
  const response = await api.get<GetProfileResponse>("/profile");
  return response.data.user;
}
