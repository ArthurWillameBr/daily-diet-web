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

export function AiReportDialog() {
  const [report, setReport] = useState<string | null>("");
  const [reportIsLoading, setReportIsLoading] = useState(false);

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

  return (
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
            Use inteligência artificial para gerar um relatório com insights
            sobre sua dieta.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="prose max-h-[450px] text-black prose-h3:text-black prose-h4:text-black prose-strong:text-black">
          <Markdown>{report}</Markdown>
        </ScrollArea>
        <DialogFooter>
          <DialogClose>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleGenerateReport} disabled={reportIsLoading}>
            <Sparkles />
            {reportIsLoading ? (
              <Loader className="animate-spin" />
            ) : (
              "Gerar relatório"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
