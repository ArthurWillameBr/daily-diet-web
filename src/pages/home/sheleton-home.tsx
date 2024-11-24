import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SkeletonHome() {
  return (
    <main className="flex flex-col h-screen max-w-6xl mx-auto px-5 pt-12">
      <div className="flex items-center justify-between p-5 md:p-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8" />
      </div>
      <div className="flex flex-col justify-center items-center p-4 md:p-8">
        <Card className="w-full max-w-[450px] md:max-w-[600px]">
          <CardContent className="bg-gray-100 text-center">
            <div className="p-5 md:p-8">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 md:px-8 py-2 md:py-4 space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex-1 px-4 md:px-8 space-y-6 pb-6 md:pb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[...Array(2)].map((_, mealIndex) => (
              <Card key={mealIndex} className="shadow-md">
                <CardContent className="flex items-center p-4 md:p-5">
                  <Skeleton className="h-4 w-12" />
                  <div className="w-[1px] h-4 mx-4 bg-gray-200" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
