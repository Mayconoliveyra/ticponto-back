export interface IPonto {
  id: number;
  usuario_id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  horario: string;

  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
