export function calculateDietPercentage(
  totalMeals?: number,
  totalMealsWithinDiet?: number
): string {
  if (!totalMeals || totalMeals === 0 || !totalMealsWithinDiet) {
    return "0%";
  }
  const percentage = (totalMealsWithinDiet / totalMeals) * 100;
  return percentage.toFixed(2);
}
