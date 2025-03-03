export interface IVwPontoFinal {
  ponto_id: number;
  usuario_id: number;
  usuario_nome: string;
  data: string; // Formato: YYYY-MM-DD

  entrada_1: string | null; // Formato: HH:MM:SS ou null
  saida_1: string | null;
  entrada_2: string | null;
  saida_2: string | null;

  extra_entrada: string | null;
  extra_saida: string | null;

  esperado_inicio_1: string | null; // Horário esperado de entrada no período 1
  esperado_saida_1: string | null; // Horário esperado de saída no período 1
  esperado_inicio_2: string | null; // Horário esperado de entrada no período 2
  esperado_saida_2: string | null; // Horário esperado de saída no período 2

  periodo_1: string | null; // Duração do período 1 (HH:MM:SS ou null)
  periodo_2: string | null; // Duração do período 2
  periodo_extra: string | null; // Duração do período extra

  total_trabalhado: string | null; // Total de horas trabalhadas no dia
  total_esperado: string | null; // Total de horas esperadas no dia

  saldo_dia: string | null; // Diferença entre total trabalhado e esperado no dia
  saldo_acumulado: string | null; // Saldo acumulado até a data

  falta: number; // 1 se houve falta, 0 caso contrário
  folga: number; // 1 se foi folga, 0 caso contrário
  feriado: number; // 1 se foi feriado, 0 caso contrário
  justificativa: number; // 1 se houve justificativa, 0 caso contrário
}
