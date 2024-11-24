import { useGamificationStatus } from "@/hooks/useGamificationStatus";
import { getHonorificTitle } from "@/utils/get-honorific-title";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronUp, ChevronDown, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

export function GamificationStatus() {
  const { data, isLoading } = useGamificationStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [titleChanged, setTitleChanged] = useState(false);

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

      const previousTitle = getHonorificTitle(previousLevel);
      const currentTitle = getHonorificTitle(data.level);
      setTitleChanged(previousTitle !== currentTitle);
    }

    if (data?.level) {
      setPreviousLevel(data.level);
    }
  }, [data?.level, previousLevel]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 p-3 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const experiencePercentage =
    (Math.floor(data?.experience ?? 0) /
      (data?.totalExperienceForNextLevel ?? 1)) *
    100;

  const currentTitle = data?.level
    ? getHonorificTitle(data.level)
    : "Sem título";

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
                {titleChanged && (
                  <p className="text-lg text-yellow-800 mb-4">
                    Novo título: <p className="font-bold">{currentTitle}</p>
                  </p>
                )}
                <motion.div
                  className="text-lg font-semibold text-yellow-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Continue assim!
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed top-5 right-5 bg-white/90 border backdrop-blur-lg shadow-lg rounded-2xl overflow-hidden"
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : "40px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <span className="text-sm font-bold text-gray-800 mr-2">
              Nível {data?.level}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </motion.div>
          </div>
        </motion.div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="p-3 space-y-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-gray-600 mb-2 font-bold">
                {currentTitle}
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>XP</span>
                  <span>
                    {Math.floor(data?.experience ?? 0)} /{" "}
                    {data?.totalExperienceForNextLevel}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${experiencePercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Próximo nível:{" "}
                {(data?.totalExperienceForNextLevel ?? 0) -
                  Math.floor(data?.experience ?? 0)}{" "}
                XP restantes
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
