import { GetBestOnDietSequence } from "@/api/get-best-on-diet-sequence";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsOutsideDiet } from "@/api/get-total-meals-outside-diet";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, TrendingUp, UtensilsCrossed, Check, X } from "lucide-react";
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
    <main className="flex flex-col h-screen">
      <Card className="w-full flex-shrink-0">
        <CardContent
          className={`${cardColor} text-center p-6 relative h-48 flex flex-col justify-center`}
        >
          <Link to="/home" className="absolute left-4 top-4">
            <ArrowLeft className={`${arrowUpRightColor} w-6 h-6`} />
          </Link>
          <h2 className="text-4xl sm:text-5xl font-semibold">
            {dietPercentage}%
          </h2>
          <p className="text-base sm:text-lg mt-2">
            das refeições dentro da dieta
          </p>
        </CardContent>
      </Card>
      <ScrollArea className="flex-grow px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex w-full items-center justify-between">
            <h2 className="font-semibold text-lg sm:text-xl">
              Estatísticas Gerais
            </h2>
            <AiReportDialog />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Card className="border-none shadow-md col-span-full">
              <CardContent className="bg-gray-50 rounded-lg text-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold">{bestOnDietSequence}</h2>
                <p className="text-sm mt-2">
                  melhor sequência de pratos dentro da dieta
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md col-span-full">
              <CardContent className="bg-gray-50 rounded-lg text-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-semibold">{totalMeals}</h2>
                <p className="text-sm mt-2">refeições registradas</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="bg-[#E5F0DB] rounded-lg text-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold">
                  {totalMealsWithinDiet}
                </h2>
                <p className="text-sm mt-2">Refeições dentro da dieta</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="bg-[#FDE8E8] rounded-lg text-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <X className="w-6 h-6 text-rose-500" />
                </div>
                <h2 className="text-2xl font-semibold">
                  {totalMealsOutsideDiet}
                </h2>
                <p className="text-sm mt-2">Refeições fora da dieta</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
