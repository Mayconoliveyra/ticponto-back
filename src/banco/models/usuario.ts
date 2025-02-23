export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
