import { api } from "@/lib/axios";

interface GetBestOnDietSequenceResponse {
  bestOnDietSequence: number;
}

export async function GetBestOnDietSequence() {
  const response = await api.get<GetBestOnDietSequenceResponse>(
    "/meals/best-diet-sequence"
  );

  return response.data.bestOnDietSequence;
}
