import { PencilLine } from "lucide-react";
import { Button } from "./ui/button";
import { UpsertMealDialog } from "./upsert-meal-dialog";
import { useState } from "react";
import { Sheet, SheetTrigger } from "./ui/sheet";

interface UpdateMealButtonProps {
  mealId: string;
  mealValues: {
    name: string;
    description: string | null;
    date: Date;
    isOnDiet: boolean;
    time: string;
  };
}

export function UpdateMealButton({
  mealId,
  mealValues,
}: UpdateMealButtonProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full">
            <PencilLine /> Editar Refeição
          </Button>
        </SheetTrigger>
        <UpsertMealDialog
          isOpen={isSheetOpen}
          setIsOpen={setIsSheetOpen}
          mealId={mealId}
          defaultValues={mealValues}
        />
      </Sheet>
    </>
  );
}
