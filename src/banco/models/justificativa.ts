export interface IJustificativa {
  id: number;
  usuario_id: number;
  data: string; // YYYY-MM-DD
  motivo: string;
  anexo?: string | null; // Opcional, caso tenha um comprovante
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}
