export interface IUsuario {
  id: number;

  nome: string;
  email: string;
  senha: string;
  contato?: string;
  notificar: boolean;
  nascimento?: string;
  ativo: boolean;
  administrador: boolean;

  empresa_id: number;

  // Horários esperados por dia da semana
  segunda_inicio_1?: string;
  segunda_saida_1?: string;
  segunda_inicio_2?: string;
  segunda_saida_2?: string;

  terca_inicio_1?: string;
  terca_saida_1?: string;
  terca_inicio_2?: string;
  terca_saida_2?: string;

  quarta_inicio_1?: string;
  quarta_saida_1?: string;
  quarta_inicio_2?: string;
  quarta_saida_2?: string;

  quinta_inicio_1?: string;
  quinta_saida_1?: string;
  quinta_inicio_2?: string;
  quinta_saida_2?: string;

  sexta_inicio_1?: string;
  sexta_saida_1?: string;
  sexta_inicio_2?: string;
  sexta_saida_2?: string;

  sabado_inicio_1?: string;
  sabado_saida_1?: string;
  sabado_inicio_2?: string;
  sabado_saida_2?: string;

  domingo_inicio_1?: string;
  domingo_saida_1?: string;
  domingo_inicio_2?: string;
  domingo_saida_2?: string;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
