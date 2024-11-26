import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RecipeCard } from "@/components/recipe-card";

interface Recipe {
  name: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
}

interface RecipeDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDialog({ recipe, isOpen, onClose }: RecipeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[525px] max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Receita Gerada
          </DialogTitle>
          <DialogDescription>
            Veja a receita gerada a partir das suas refeições
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-100px)] overflow-y-auto">
          <div className="p-6 pt-0 pb-8">
            {recipe ? (
              <RecipeCard recipe={recipe} />
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma receita gerada
              </p>
            )}
          </div>
          <ScrollBar />
          <div className="h-36 bg-gradient-to-t from-background to-transparent pointer-events-none sticky bottom-0" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
