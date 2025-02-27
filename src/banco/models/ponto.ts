export interface IPonto {
  id: number;
  usuario_id: number;
  data: string; // YYYY-MM-DD
  entrada_1?: string; // HH:MM:SS
  saida_1?: string;
  entrada_2?: string;
  saida_2?: string;
  extra_entrada?: string;
  extra_saida?: string;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
