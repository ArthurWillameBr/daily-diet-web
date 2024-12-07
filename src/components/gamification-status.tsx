import { GetProfile } from "@/api/get-profile";
import { useGamificationStatus } from "@/hooks/useGamificationStatus";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Trophy,
  User,
  Mail,
  Star,
  ChevronDown,
  LogOut,
  CreditCard,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function GamificationStatus() {
  const { data, isLoading } = useGamificationStatus();
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [previousCredits, setPreviousCredits] = useState<number | null>(null);

  const { signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetProfile,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (data?.level && previousLevel !== null) {
      if (data.level > previousLevel) {
        setShowLevelUpAnimation(true);
        setTimeout(() => setShowLevelUpAnimation(false), 5000);
      }
    }

    if (data?.level) {
      setPreviousLevel(data.level);
    }

    if (data?.creditsEarned) {
      setPreviousCredits(data.creditsEarned - 1);
    }
  }, [data?.level, previousLevel, data?.creditsEarned]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 p-3 bg-white/10 backdrop-blur-lg rounded-full shadow-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const experiencePercentage =
    ((data?.experience ?? 0) / (data?.totalExperienceForNextLevel ?? 1)) * 100;

  return (
    <>
      <AnimatePresence>
        {showLevelUpAnimation && (
          <>
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.1}
            />
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg rounded-2xl p-8 text-center max-w-sm w-full mx-4"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Trophy className="w-16 h-16 text-yellow-700 mx-auto mb-4" />
                </motion.div>
                <h1 className="text-4xl font-bold text-yellow-800 mb-2">
                  Parabéns!
                </h1>
                <p className="text-xl text-yellow-900 mb-2">
                  Você alcançou o Nível {data?.level}!
                </p>
                <p className="text-lg text-yellow-800 mb-4">
                  Seu título: <span className="font-bold">{data?.title}</span>
                </p>
                <motion.div
                  className="text-lg font-semibold text-yellow-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Você ganhou 1 crédito!
                </motion.div>
                <motion.div
                  className="text-lg font-semibold text-yellow-700 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Continue assim!
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="fixed top-4 right-6 border flex items-center space-x-2 bg-white/90 backdrop-blur-lg shadow-lg rounded-md p-2 pr-4 hover:bg-white/95 transition-colors">
            <span className="font-medium text-sm">{profile?.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 mt-2" align="end">
          <DropdownMenuLabel>Perfil do Usuário</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{profile?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Nível {data?.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <div className="text-sm text-gray-600 flex items-center">
                Créditos {data?.creditsEarned}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-500 ml-1 mb-[1px] cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Use creditor para gerar receitas com IA
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{data?.title}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>XP</span>
              <span>
                {Math.floor(data?.experience ?? 0)} /{" "}
                {data?.totalExperienceForNextLevel}
              </span>
            </div>
            <Progress value={experiencePercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Próximo nível</span>
              <span>
                {(data?.totalExperienceForNextLevel ?? 0) -
                  Math.floor(data?.experience ?? 0)}{" "}
                XP restantes
              </span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm">Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
