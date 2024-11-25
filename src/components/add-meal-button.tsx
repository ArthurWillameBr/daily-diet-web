import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { UpsertMealDialog } from "./upsert-meal-dialog";
import { useState } from "react";
import { Sheet, SheetTrigger } from "./ui/sheet";

export function AddMealButton() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            onClick={() => setDialogIsOpen(true)}
            className="w-full h-12 md:h-14 text-base md:text-lg"
          >
            <Plus className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Nova refeição
          </Button>
        </SheetTrigger>
      </Sheet>
      <UpsertMealDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
}
