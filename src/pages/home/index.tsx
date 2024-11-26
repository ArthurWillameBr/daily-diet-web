import { GetMeal } from "@/api/get-meal";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { GamificationStatus } from "@/components/gamification-status";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SkeletonHome } from "./sheleton-home";
import { AddMealButton } from "@/components/add-meal-button";
import { MealsDetailsDialog } from "@/components/meal-details-dialog";
import { ArrowUpRight, Utensils } from "lucide-react";

export function Home() {
  const { data: meals, isLoading: isMealsLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: GetMeal,
  });

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

  const dietPercentage = calculateDietPercentage(
    totalMeals,
    totalMealsWithinDiet
  );

  const isLoading =
    isMealsLoading || isTotalMealsLoading || isTotalMealsWithinDietLoading;

  if (isLoading) {
    return <SkeletonHome />;
  }

  const cardColor =
    Number(dietPercentage) >= 50 ? "bg-[#E5F0DB]" : "bg-[#FDE8E8]";
  const arrowUpRightColor =
    Number(dietPercentage) >= 50 ? "text-lime-500" : "text-red-500";

  return (
    <>
      <div className="flex items-center gap-2 ml-6 mt-2">
        <Utensils className="w-6 h-6 md:w-8 md:h-8" />
        <div className="flex flex-col leading-3">
          <p className="text-base md:text-lg">Daily</p>
          <p className="text-base md:text-lg font-semibold">Diet</p>
        </div>
      </div>
      <main className="flex flex-col h-screen max-w-6xl mx-auto px-5 pt-4">
        <GamificationStatus />
        <div className="flex flex-col justify-center items-center p-4 md:p-8">
          <Link
            to="/statistics"
            className="w-full max-w-[450px] md:max-w-[600px] relative rounded-lg"
          >
            <Card>
              <CardContent className={`${cardColor} text-center`}>
                <div className="relative">
                  <ArrowUpRight
                    className={`${arrowUpRightColor} absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8`}
                  />
                </div>
                <div className="p-5 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-semibold">
                    {dietPercentage}%
                  </h2>
                  <p className="md:text-lg">das refeições dentro da dieta</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="px-4 md:px-8 py-2 md:py-4 space-y-3">
          <h2 className="font-semibold text-lg md:text-xl">Refeições</h2>
          <AddMealButton />
        </div>
        <ScrollArea className="flex-1 px-4 pb-12 md:px-8">
          <div className="space-y-6 pb-6 md:pb-8">
            {meals?.map((meal, index) => (
              <div key={index} className="space-y-4">
                <h2 className="font-medium text-base md:text-lg pt-4">
                  {meal.date}
                </h2>
                {meal.meals.map((meal, index) => (
                  <MealsDetailsDialog key={index} meal={meal} />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </>
  );
}
