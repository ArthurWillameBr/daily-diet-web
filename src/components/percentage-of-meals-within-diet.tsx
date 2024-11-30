import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { ArrowUpRight } from "lucide-react";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";

export function PercentageOfMealsWithinDiet() {
  const { data: totalMeals } = useQuery({
    queryKey: ["total-meals"],
    queryFn: GetTotalMeals,
  });

  const { data: totalMealsWithinDiet } = useQuery({
    queryKey: ["meals-within-diet"],
    queryFn: GetTotalMealsWithinDiet,
  });

  const dietPercentage = calculateDietPercentage(
    totalMeals,
    totalMealsWithinDiet
  );

  const cardColor =
    Number(dietPercentage) > 0
      ? Number(dietPercentage) >= 50
        ? "bg-[#E5F0DB]"
        : "bg-[#FDE8E8]"
      : "bg-gray-100";
  const arrowUpRightColor =
    Number(dietPercentage) > 0
      ? Number(dietPercentage) >= 50
        ? "text-lime-500"
        : "text-red-500"
      : "text-gray-400";

  return (
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
              {Number(dietPercentage) > 0 ? (
                <>
                  <h2 className="text-2xl md:text-4xl font-semibold">
                    {dietPercentage}%
                  </h2>
                  <p className="md:text-lg">das refeições dentro da dieta</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-4xl font-semibold text-gray-600">
                    0%
                  </h2>
                  <p className="md:text-lg text-gray-600">
                    Nenhuma refeição adicionada ainda
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
