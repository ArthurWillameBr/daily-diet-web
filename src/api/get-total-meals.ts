import { api } from "@/lib/axios";

interface TotalMeasResponse {
  mealsCount: number;
}

export async function GetTotalMeals() {
  const response = await api.get<TotalMeasResponse>("/meals/total");

  return response.data.mealsCount;
}
