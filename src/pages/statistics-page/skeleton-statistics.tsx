import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BotIcon } from "lucide-react";

export function SkeletonStatistics() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Card className="w-full h-32">
        <CardContent className="bg-gray-100 text-center h-full">
          <div className="relative">
            <ArrowLeft className="absolute top-4 left-2 w-6 h-6 md:w-8 md:h-8 text-gray-300" />
          </div>
          <div className="pt-7 md:p-8">
            <Skeleton className="h-8 w-24 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full items-center justify-between py-6 pl-12">
        <div className="w-full text-left md:text-center">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="absolute right-4">
          <Button size="sm" className="flex items-center" disabled>
            <BotIcon />
            Relatório com IA
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Card className="border-none shadow-md flex-1">
            <CardContent className="bg-gray-50 rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md flex-1">
            <CardContent className="bg-gray-50 rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
