import { AiReport } from "@/api/ai-report";
import { GetBestOnDietSequence } from "@/api/get-best-on-diet-sequence";
import { GetTotalMeals } from "@/api/get-total-meals";
import { GetTotalMealsOutsideDiet } from "@/api/get-total-meals-outside-diet";
import { GetTotalMealsWithinDiet } from "@/api/get-total-meals-within-diet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateDietPercentage } from "@/utils/calculate-diet-percentage";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BotIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";

export function StatisticsPage() {
  const [report, setReport] = useState<string | null>("");

  async function handleGenerateReport() {
    const aiReport = await AiReport();
    setReport(aiReport.report);
  }

  const { data: totalMeals } = useQuery({
    queryKey: ["total-meals"],
    queryFn: GetTotalMeals,
  });

  const { data: totalMealsWithinDiet } = useQuery({
    queryKey: ["meals-within-diet"],
    queryFn: GetTotalMealsWithinDiet,
  });

  const { data: bestOnDietSequence } = useQuery({
    queryKey: ["best-on-diet-sequence"],
    queryFn: GetBestOnDietSequence,
  });

  const { data: totalMealsOutsideDiet } = useQuery({
    queryKey: ["meals-outside-diet"],
    queryFn: GetTotalMealsOutsideDiet,
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
    <main className="flex flex-col items-center justify-center">
      <Card className="w-full h-32">
        <CardContent className={`${cardColor} text-center h-full`}>
          <div className="relative">
            <Link to="/home" className="absolute left-0 top-0 p-4">
              <ArrowLeft
                className={`${arrowUpRightColor} absolute top-4 left-2 w-6 h-6 md:w-8 md:h-8`}
              />
            </Link>
          </div>
          <div className="pt-7 md:p-8">
            <h2 className="text-2xl md:text-4xl font-semibold">
              {dietPercentage}%
            </h2>
            <p className="md:text-lg">das refeições dentro da dieta</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full items-center justify-between py-6 pl-12">
        <div className="w-full text-left md:text-center">
          <h2 className="font-semibold">Estatísticas Gerais</h2>
        </div>
        <div className="absolute right-4">
          <Dialog
            onOpenChange={(open) => {
              if (!open) {
                setReport(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <BotIcon />
                Relatório com IA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Relatório com IA</DialogTitle>
                <DialogDescription>
                  Use inteligência artificial para gerar um relatório com
                  insights sobre sua dieta.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="prose max-h-[450px] text-black prose-h3:text-black prose-h4:text-black prose-strong:text-black">
                <Markdown>{report}</Markdown>
              </ScrollArea>
              <DialogFooter>
                <DialogClose>
                  <Button variant="ghost">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleGenerateReport}>
                  <Sparkles />
                  Gerar relatório
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-3">
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <h2 className="text-2xl font-semibold">{bestOnDietSequence}</h2>
              <p className="text-sm">
                melhor sequência de pratos dentro da dieta
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="bg-gray-50 rounded-lg text-center h-full">
            <div className="pt-7 md:p-8">
              <h2 className="text-2xl font-semibold">{totalMeals}</h2>
              <p className="text-sm">refeições registradas</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Card className="border-none shadow-md ">
            <CardContent className="bg-[#E5F0DB] rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <h2 className="text-2xl font-semibold">
                  {totalMealsWithinDiet}
                </h2>
                <p className="text-sm">Refeições dentro da dieta</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="bg-[#FDE8E8] rounded-lg text-center h-full">
              <div className="pt-7 md:p-8">
                <h2 className="text-2xl font-semibold">
                  {totalMealsOutsideDiet}
                </h2>
                <p className="text-sm">Refeições fora da dieta</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
