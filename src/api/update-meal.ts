import { api } from "@/lib/axios";

interface UpdateMealRequest {
  mealId: string;
  name: string;
  description: string | null;
  dateTime: Date;
  isOnDiet: boolean;
}

export async function UpdateMeal({
  name,
  dateTime,
  description,
  isOnDiet,
  mealId,
}: UpdateMealRequest) {
  await api.put(`/meals/${mealId}/update`, {
    name,
    dateTime,
    description,
    isOnDiet,
  });
}
