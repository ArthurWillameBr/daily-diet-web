import { GetBestOnDietSequence } from "@/api/get-best-on-diet-sequence";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsOutsideDiet } from "@/api/get-total-meals-outside-diet";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SkeletonStatistics } from "./skeleton-statistics";
import { AiReportDialog } from "@/components/ai-report-dialog";

export function StatisticsPage() {
  const { data: totalMeals, isLoading: isTotalMealsLoading } = useQuery({
    queryKey: ["total-meals"],
    queryFn: GetTotalMeals,
  });

  const {
    data: totalMealsWithinDiet,
    isLoading: isTotalMealsWithinDietLoading,
  } = useQuery({
    queryKey: ["meals-within-diet"],
    queryFn: GetTotalMealsWithinDiet,
  });

  const { data: bestOnDietSequence, isLoading: isBestOnDietSequenceLoading } =
    useQuery({
      queryKey: ["best-on-diet-sequence"],
      queryFn: GetBestOnDietSequence,
    });

  const { data: totalMealsOutsideDiet, isLoading: isMealsOutsideDietLoading } =
    useQuery({
      queryKey: ["meals-outside-diet"],
      queryFn: GetTotalMealsOutsideDiet,
    });

  const isLoading =
    isTotalMealsLoading ||
    isTotalMealsWithinDietLoading ||
    isBestOnDietSequenceLoading ||
    isMealsOutsideDietLoading;

  if (isLoading) {
    return <SkeletonStatistics />;
  }

  const dietPercentage = calculateDietPercentage(
    totalMeals,
    totalMealsWithinDiet
  );

  const cardColor =
    Number(dietPercentage) >= 50 ? "bg-[#E5F0DB]" : "bg-[#FDE8E8]";

  const arrowUpRightColor =
    Number(dietPercentage) >= 50 ? "text-lime-500" : "text-red-500";

  return (
    <main className="flex flex-col items-center justify-center">
      <Card className="w-full h-32">
        <CardContent className={`${cardColor} text-center h-full`}>
          <div className="relative">
            <Link to="/home" className="absolute left-0 top-0 p-4">
              <ArrowLeft
                className={`${arrowUpRightColor} absolute top-4 left-2 w-6 h-6 md:w-8 md:h-8`}
              />
            </Link>
          </div>
          <div className="pt-7 md:p-8">
            <h2 className="text-2xl md:text-4xl font-semibold">
              {dietPercentage}%
            </h2>
            <p className="md:text-lg">das refeições dentro da dieta</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full items-center justify-between py-6 pl-12">
        <div className="w-full text-left md:text-center">
          <h2 className="font-semibold">Estatísticas Gerais</h2>
        </div>
        <div className="absolute right-4">
          <AiReportDialog />
        </div>
      </div>
      <div className="space-y-3">
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <h2 className="text-2xl font-semibold">{bestOnDietSequence}</h2>
              <p className="text-sm">
                melhor sequência de pratos dentro da dieta
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <h2 className="text-2xl font-semibold">{totalMeals}</h2>
              <p className="text-sm">refeições registradas</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Card className="border-none shadow-md ">
            <CardContent className="bg-[#E5F0DB] rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <h2 className="text-2xl font-semibold">
                  {totalMealsWithinDiet}
                </h2>
                <p className="text-sm">Refeições dentro da dieta</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="bg-[#FDE8E8] rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <h2 className="text-2xl font-semibold">
                  {totalMealsOutsideDiet}
                </h2>
                <p className="text-sm">Refeições fora da dieta</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
