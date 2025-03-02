export interface IVwPonto {
  ponto_id: number;
  usuario_id: number;
  usuario_nome: string;
  data: string; // YYYY-MM-DD

  // Registros de ponto
  entrada_1: string | null; // HH:MM:SS ou null
  saida_1: string | null;
  entrada_2: string | null;
  saida_2: string | null;
  extra_entrada: string | null;
  extra_saida: string | null;

  // Horários esperados
  esperado_inicio_1: string | null; // HH:MM:SS ou null
  esperado_saida_1: string | null;
  esperado_inicio_2: string | null;
  esperado_saida_2: string | null;

  // Períodos individuais
  periodo_1: string; // HH:MM:SS (pode ser '00:00:00' se não houver entrada/saída)
  periodo_2: string;
  periodo_extra: string;

  // Total trabalhado e esperado
  total_trabalhado: string; // Soma dos períodos (HH:MM:SS)
  total_esperado: string; // Total de horas esperadas no dia (HH:MM:SS)

  // Saldo do dia e saldo acumulado
  saldo_dia: string | null; // Diferença entre trabalhado e esperado no dia (HH:MM:SS)
  saldo_acumulado: string | null; // Soma dos saldos anteriores + saldo do dia (HH:MM:SS)

  // Indicadores de status do dia
  falta: number; // 1 se o funcionário deveria ter trabalhado e não registrou, 0 caso contrário
  folga: number; // 1 se o dia é uma folga, 0 caso contrário
  feriado: number; // 1 se o dia for feriado, 0 caso contrário
  divergencia: number; // 1 se houver alguma divergência > 5 min, 0 caso contrário

  // Datas de criação e atualização do registro
  created_at: string; // Timestamp
  updated_at: string | null;
  deleted_at: string | null;
}
