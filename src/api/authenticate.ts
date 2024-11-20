import { api } from "@/lib/axios";

export interface AuthenticateRequest {
  email: string;
  password: string;
}

export async function Authenticate({ email, password }: AuthenticateRequest) {
  const response = await api.post("/sessions", {
    email,
    password,
  });

  return response.data;
}
