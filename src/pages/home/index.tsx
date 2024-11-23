import { GetMeal } from "@/api/get-meal";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { AddMealsForm } from "@/components/add-meals-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import {
  ArrowUpRight,
  PencilLine,
  Settings,
  Trash2,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Home() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const [isOpen, setIsOpen] = useState(false);

  const { data: meals } = useQuery({
    queryKey: ["meals"],
    queryFn: GetMeal,
  });

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
    Number(dietPercentage) >= 50 ? "bg-[#E5F0DB]" : "bg-[#FDE8E8]";

  const arrowUpRightColor =
    Number(dietPercentage) >= 50 ? "text-lime-500" : "text-red-500";

  return (
    <main className="flex flex-col h-screen max-w-6xl mx-auto px-5">
      <div className="flex items-center justify-between p-5 md:p-8">
        <div className="flex items-center gap-2">
          <Utensils className="w-6 h-6 md:w-8 md:h-8" />
          <div className="flex flex-col leading-3">
            <p className="text-base md:text-lg">Daily</p>
            <p className="text-base md:text-lg font-semibold">Diet</p>
          </div>
        </div>
        <div>
          <Settings className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>
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
        <AddMealsForm isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8">
        <div className="space-y-6 pb-6 md:pb-8">
          {meals?.map((meal, index) => (
            <div key={index} className="space-y-4">
              <h2 className="font-medium text-base md:text-lg pt-4">
                {meal.date}
              </h2>
              {meal.meals.map((meal, index) => (
                <Sheet key={index}>
                  <SheetTrigger asChild>
                    <Card className="shadow-md cursor-pointer">
                      <CardContent className="flex items-center p-4 md:p-5">
                        <span className="text-sm md:text-base">
                          {meal.time}
                        </span>
                        <div className="w-[1px] h-4 mx-4 bg-slate-500" />
                        <span className="flex-1 text-sm md:text-base">
                          {meal.name}
                        </span>
                        <div
                          className={`${
                            meal.isOnDiet ? "bg-[#E5F0DB]" : "bg-[#FDE8E8]"
                          } rounded-full size-4 md:size-5`}
                        />
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent
                    side={isLargeScreen ? "right" : "bottom"}
                    className="flex flex-col"
                  >
                    <SheetHeader>
                      <SheetTitle>Refeição</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 md:p-5 flex-grow overflow-auto">
                      <h3 className="font-semibold text-lg">{meal.name}</h3>
                      <p className="text-sm md:text-base text-gray-500/90">
                        {meal.description}
                      </p>
                      <h2 className="pt-4 text-md font-semibold">
                        Data e Hora
                      </h2>
                      <p className="text-sm md:text-base text-gray-500/90 pt-2">
                        {formatDate(new Date(meal.date), "dd/MM/yyyy")} às{" "}
                        {meal.time}
                      </p>
                      <Badge className="bg-slate-100 px-3 py-2 rounded-full flex items-center gap-2 w-fit mt-4">
                        <div
                          className={`${
                            meal.isOnDiet ? "bg-green-500" : "bg-red-500"
                          } rounded-full size-2`}
                        />
                        <p className="text-gray-500/90">
                          {meal.isOnDiet ? "Dentro da dieta" : "Fora da dieta"}
                        </p>
                      </Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button className="w-full">
                        <PencilLine />
                        Editar Refeição
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full border-2 border-neutral-900"
                      >
                        <Trash2 />
                        Excluir Refeição
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
