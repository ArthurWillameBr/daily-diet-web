import { formatDate } from "date-fns";
import { Card, CardContent } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { UpdateMealButton } from "./update-meal-button";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteMeal } from "@/api/delete-meal";

interface MealDetailsProps {
  meal: {
    id: string;
    name: string;
    description: string | null;
    time: string;
    date: Date;
    isOnDiet: boolean;
  };
}

export function MealsDetailsDialog({ meal }: MealDetailsProps) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const queryClient = useQueryClient();

  const { mutateAsync: deleteMeal } = useMutation({
    mutationFn: DeleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["total-meals"] });
      queryClient.invalidateQueries({ queryKey: ["meals-within-diet"] });
    },
  });

  async function handleDeleteMeal(mealId: string) {
    try {
      await deleteMeal({ mealId });
      toast.success("Refeição excluída com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir refeição");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="shadow-md cursor-pointer">
          <CardContent className="flex items-center p-4 md:p-5">
            <span className="text-sm md:text-base">{meal.time}</span>
            <div className="w-[1px] h-4 mx-4 bg-slate-500" />
            <span className="flex-1 text-sm md:text-base">{meal.name}</span>
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
            {meal.description || "Sem descrição"}
          </p>
          <h2 className="pt-4 text-md font-semibold">Data e Hora</h2>
          <p className="text-sm md:text-base text-gray-500/90 pt-2">
            {formatDate(new Date(meal.date), "dd/MM/yyyy")} às {meal.time}
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
          <UpdateMealButton mealId={meal.id} mealValues={meal} />
          <Button
            onClick={() => handleDeleteMeal(meal.id)}
            variant="ghost"
            className="w-full border-2 border-neutral-900"
          >
            <Trash2 /> Excluir Refeição
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
