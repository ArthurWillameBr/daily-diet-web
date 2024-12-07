import { GetBestOnDietSequence } from "@/api/get-best-on-diet-sequence";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsOutsideDiet } from "@/api/get-total-meals-outside-diet";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  TrendingUp,
  UtensilsCrossed,
  Check,
  X,
  ChefHat,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SkeletonStatistics } from "./skeleton-statistics";
import { AiReportDialog } from "@/components/ai-report-dialog";
import { Button } from "@/components/ui/button";
import { RevenueGeneration } from "@/api/revenue-generation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { RecipeDialog } from "@/components/recipe-dialog";
import { useGamificationStatus } from "@/hooks/useGamificationStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StatisticsPage() {
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const { data: gamificationStatus } = useGamificationStatus();

  const queryClient = useQueryClient();

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

  const { data: revenueGenerate, mutateAsync: generateRecipe } = useMutation({
    mutationFn: RevenueGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification-status"] });
    },
  });

  async function handleGenerateRecipe() {
    if ((gamificationStatus?.creditsEarned ?? 0) < 1) {
      return;
    }
    setIsGeneratingRecipe(true);
    try {
      await generateRecipe();
      setIsRecipeDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    } finally {
      setIsGeneratingRecipe(false);
    }
  }

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
      <div className="w-[800px] mx-auto space-y-6">
        <div className="flex w-full items-center justify-between mt-4">
          <h2 className="font-semibold text-lg sm:text-xl">
            Estatísticas Gerais
          </h2>
          <div className="flex gap-2 items-center">
            <AiReportDialog />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block cursor-pointer">
                    {" "}
                    <Button
                      size="sm"
                      onClick={handleGenerateRecipe}
                      disabled={
                        isGeneratingRecipe ||
                        (gamificationStatus?.creditsEarned ?? 0) < 1
                      }
                    >
                      {isGeneratingRecipe ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ChefHat className="mr-2 h-4 w-4" />
                      )}
                      Gerar Receita
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {(gamificationStatus?.creditsEarned ?? 0) < 1
                    ? "Você precisa de pelo menos 1 crédito para gerar uma receita."
                    : `Você tem ${gamificationStatus?.creditsEarned} crédito(s) disponível(is).`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
              <h2 className="text-2xl font-semibold">{totalMealsWithinDiet}</h2>
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
        <RecipeDialog
          recipe={revenueGenerate?.recipe || null}
          isOpen={isRecipeDialogOpen}
          onClose={() => setIsRecipeDialogOpen(false)}
        />
      </div>
    </main>
  );
}
