export interface IPonto {
  id: number;
  usuario_id: number;
  data: string; // YYYY-MM-DD
  entrada_1?: string | null; // HH:MM:00
  saida_1?: string | null;
  entrada_2?: string | null;
  saida_2?: string | null;

  esperado_inicio_1?: string | null; // HH:MM:00
  esperado_saida_1?: string | null;
  esperado_inicio_2?: string | null;
  esperado_saida_2?: string | null;

  extra_entrada?: string;
  extra_saida?: string;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
