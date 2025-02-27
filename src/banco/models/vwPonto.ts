export interface IVwPonto {
  ponto_id: number;
  usuario_id: number;
  usuario_nome: string;
  data: string; // YYYY-MM-DD
  entrada_1: string | null; // HH:MM:SS ou null
  saida_1: string | null;
  entrada_2: string | null;
  saida_2: string | null;
  extra_entrada: string | null;
  extra_saida: string | null;
  periodo_1: string; // HH:MM:SS (pode ser '00:00:00' se não houver entrada/saída)
  periodo_2: string;
  periodo_extra: string;
  total_trabalhado: string; // Soma dos períodos (HH:MM:SS)
  saldo_anterior: string | null; // Pode ser NULL se não houver registros anteriores
  created_at: string; // Timestamp
  updated_at: string | null;
  deleted_at: string | null;
}
