import { api } from "@/lib/axios";

interface FormattedMeal {
  time: string;
  name: string;
  isOnDiet: boolean;
}

interface GetMealsUseCaseResponse {
  meals: Array<{
    date: string;
    meals: FormattedMeal[];
  }>;
}

export async function GetMeal() {
  const response = await api.get<GetMealsUseCaseResponse>("/meals");
  return response.data.meals;
}
