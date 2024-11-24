import { GetGamificationStatus } from "@/api/get-gamification-status";
import { useQuery } from "@tanstack/react-query";

export function useGamificationStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gamification-status"],
    queryFn: GetGamificationStatus,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  console.log(data);
  return {
    data,
    isLoading,
    error,
  };
}
