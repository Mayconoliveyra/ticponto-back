export interface IEmpresa {
  id: number;
  nome: string;
  cnpj_cpf: string;
  ativo: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
