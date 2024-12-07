import { api } from "@/lib/axios";

interface RevenueGenerationResponse {
  recipe: {
    name: string;
    ingredients: Array<{
      name: string;
      amount: string;
    }>;
    steps: string[];
  };
}

export async function RevenueGeneration() {
  const response = await api.get<RevenueGenerationResponse>(
    "/meals/generate-recipe"
  );

  return response.data;
}
