import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ingredient {
  name: string;
  amount: string;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-center">
          {recipe.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredientes::</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="flex-grow">
                    <span className="font-medium">{ingredient.name}</span> -{" "}
                    {ingredient.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Instruções:</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-medium mr-2">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
