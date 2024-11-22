import { api } from "@/lib/axios";

interface CreateMealRequest {
  name: string;
  description: string | null;
  dateTime: Date;
  isOnDiet: boolean;
}

export async function CreateMeal({
  dateTime,
  description,
  isOnDiet,
  name,
}: CreateMealRequest) {
  await api.post("/meals", {
    dateTime,
    description,
    isOnDiet,
    name,
  });
}
