const honorificTitles: { [level: number]: string } = {
  1: "Iniciante Nutricional",
  5: "Explorador de Sabores",
  10: "Conquistador da Saúde",
  20: "Mestre da Nutrição",
  30: "Guru do Bem-Estar",
  40: "Sábio da Alimentação",
  50: "Mestre dos Alimentos",
};

export function getHonorificTitle(level: number): string {
  const titles = Object.entries(honorificTitles).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
  for (const [threshold, title] of titles) {
    if (level >= Number(threshold)) {
      return title;
    }
  }
  return "Sem título";
}
