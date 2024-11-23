import { api } from "@/lib/axios";

interface AiReportResponse {
  report: string;
}

export async function AiReport() {
  const response = await api.get<AiReportResponse>("/meals/ai-report");

  return response.data;
}
