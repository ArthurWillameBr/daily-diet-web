import { api } from "@/lib/axios";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function Register({ name, email, password }: RegisterRequest) {
  await api.post("/users", {
    name,
    email,
    password,
  });
}
