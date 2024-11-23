import { api } from "@/lib/axios";

interface DeleteMealUseCaseRequest {
  mealId: string;
}

export async function DeleteMeal({ mealId }: DeleteMealUseCaseRequest) {
  await api.delete(`/meals/${mealId}`);
}
