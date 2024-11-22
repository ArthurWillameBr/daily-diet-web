import { GetMeal } from "@/api/get-meal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Plus, Settings, Utensils } from "lucide-react";

export function Home() {
  const { data: meals } = useQuery({
    queryKey: ["meals"],
    queryFn: GetMeal,
  });

  console.log(meals);
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
        <Card className="w-full max-w-[450px] md:max-w-[600px] relative rounded-lg">
          <CardContent className="bg-[#E5F0DB] text-center">
            <div className="relative">
              <ArrowUpRight className="absolute top-2 right-2 text-lime-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="p-5 md:p-8">
              <h2 className="text-2xl md:text-4xl font-semibold">98.3%</h2>
              <p className="md:text-lg">das refeições dentro da dieta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 md:px-8 py-2 md:py-4 space-y-3">
        <h2 className="font-semibold text-lg md:text-xl">Refeições</h2>
        <Button className="w-full h-12 md:h-14 text-base md:text-lg">
          <Plus className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Nova refeição
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 md:px-8">
        <div className="space-y-6 pb-6 md:pb-8">
          {meals?.map((meal, index) => (
            <div key={index} className="space-y-4">
              <h2 className="font-medium text-base md:text-lg pt-4">
                {meal.date}
              </h2>
              {meal.meals.map((meal, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="flex items-center p-4 md:p-5">
                    <span className="text-sm md:text-base">{meal.time}</span>
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
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
