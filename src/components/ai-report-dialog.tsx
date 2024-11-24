import { BotIcon, Loader, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import Markdown from "react-markdown";
import { AiReport } from "@/api/ai-report";
import { useState } from "react";
import { useGamificationStatus } from "@/hooks/useGamificationStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function AiReportDialog() {
  const [report, setReport] = useState<string | null>("");
  const [reportIsLoading, setReportIsLoading] = useState(false);

  const { data } = useGamificationStatus();

  async function handleGenerateReport() {
    try {
      setReportIsLoading(true);
      const aiReport = await AiReport();
      setReport(aiReport.report);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  }

  const isLevelTenOrHigher = (data?.level ?? 0) >= 10;

  return (
    <TooltipProvider>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setReport(null);
          }
        }}
      >
        {isLevelTenOrHigher ? (
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="flex items-center">
                  <BotIcon className="mr-2 h-4 w-4" />
                  Relatório com IA
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Use inteligência artificial para gerar um relatório com insights
                sobre sua dieta.
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="flex items-center bg-opacity-40 hover:bg-neutral-950 hover:bg-opacity-40"
              >
                <BotIcon className="mr-2 h-4 w-4" />
                Relatório com IA
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Você precisa atingir o nível 10 para gerar um relatório com IA.
            </TooltipContent>
          </Tooltip>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Relatório com IA</DialogTitle>
            <DialogDescription>
              Use inteligência artificial para gerar um relatório com insights
              sobre sua dieta.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="prose max-h-[450px] text-black prose-h3:text-black prose-h4:text-black prose-strong:text-black">
            <Markdown>{report}</Markdown>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleGenerateReport} disabled={reportIsLoading}>
              {reportIsLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {reportIsLoading ? "Gerando..." : "Gerar relatório"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
