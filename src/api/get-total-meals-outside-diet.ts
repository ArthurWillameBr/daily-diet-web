import { api } from "@/lib/axios";

interface GetTotalMealsOutsideDietResponse {
  mealsOutsideDietCount: number;
}

export async function GetTotalMealsOutsideDiet() {
  const response = await api.get<GetTotalMealsOutsideDietResponse>(
    "/meals/outside-diet"
  );

  return response.data.mealsOutsideDietCount;
}
