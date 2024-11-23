import { api } from "@/lib/axios";

interface FormattedMeal {
  id: string;
  time: string;
  name: string;
  description: string | null;
  date: Date;
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
