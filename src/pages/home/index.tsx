import { GetMeal } from "@/api/get-meal";
import { GamificationStatus } from "@/components/gamification-status";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { SkeletonHome } from "./sheleton-home";
import { AddMealButton } from "@/components/add-meal-button";
import { MealsDetailsDialog } from "@/components/meal-details-dialog";
import { Utensils } from "lucide-react";
import { PercentageOfMealsWithinDiet } from "@/components/percentage-of-meals-within-diet";

export function Home() {
  const { data: meals, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: GetMeal,
  });

  if (isLoading) {
    return <SkeletonHome />;
  }

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
        <PercentageOfMealsWithinDiet />
        <div className="px-4 md:px-8 py-2 md:py-4 space-y-3">
          <h2 className="font-semibold text-lg md:text-xl">Refeições</h2>
          <AddMealButton />
        </div>
        <ScrollArea className="flex-1 px-4 pb-12 md:px-8">
          {meals && meals.length > 0 ? (
            <div className="space-y-6 pb-6 md:pb-8">
              {meals.map((meal, index) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center mt-2 h-full text-center">
              <Utensils className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-600 mb-2">
                Nenhuma refeição cadastrada
              </p>
              <p className="text-gray-500">
                Clique no botão "Adicionar Refeição" para começar a registrar
                suas refeições.
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </>
  );
}
