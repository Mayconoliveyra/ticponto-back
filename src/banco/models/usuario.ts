export interface IUsuario {
  id: number;

  nome: string;
  email: string;
  senha: string;
  contato?: string | null;
  notificar: boolean;
  nascimento?: string | null;
  ativo: boolean;
  administrador: boolean;

  empresa_id: number;

  // Horários esperados por dia da semana
  segunda_inicio_1?: string | null; // HH:MM:00
  segunda_saida_1?: string | null;
  segunda_inicio_2?: string | null;
  segunda_saida_2?: string | null;

  terca_inicio_1?: string | null;
  terca_saida_1?: string | null;
  terca_inicio_2?: string | null;
  terca_saida_2?: string | null;

  quarta_inicio_1?: string | null;
  quarta_saida_1?: string | null;
  quarta_inicio_2?: string | null;
  quarta_saida_2?: string | null;

  quinta_inicio_1?: string | null;
  quinta_saida_1?: string | null;
  quinta_inicio_2?: string | null;
  quinta_saida_2?: string | null;

  sexta_inicio_1?: string | null;
  sexta_saida_1?: string | null;
  sexta_inicio_2?: string | null;
  sexta_saida_2?: string | null;

  sabado_inicio_1?: string | null;
  sabado_saida_1?: string | null;
  sabado_inicio_2?: string | null;
  sabado_saida_2?: string | null;

  domingo_inicio_1?: string | null;
  domingo_saida_1?: string | null;
  domingo_inicio_2?: string | null;
  domingo_saida_2?: string | null;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
