import { api } from "@/lib/axios";

interface GetTotalMealsWithinDiet {
  mealsWithinDietCount: number;
}

export async function GetTotalMealsWithinDiet() {
  const response = await api.get<GetTotalMealsWithinDiet>("/meals/within-diet");

  return response.data.mealsWithinDietCount;
}
