export interface IFeriado {
  id: number;
  data: string; // YYYY-MM-DD
  descricao: string;
  nacional: boolean; // Se é um feriado nacional ou regional
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}
