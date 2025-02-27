import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IPonto } from '../banco/models/ponto';

import { Util } from '../util';

// Registrar novo ponto
const registrar = async (ponto: Omit<IPonto, 'created_at' | 'id'>): Promise<boolean> => {
  try {
    return await Knex(ETableNames.pontos).insert(ponto);
  } catch (error) {
    Util.log.error('Erro ao registrar ponto', error);
    return false;
  }
};

// Buscar registro do dia
const buscarRegistroPorData = async (usuario_id: number, data: string): Promise<IPonto | null> => {
  try {
    const registro = await Knex(ETableNames.pontos).where({ usuario_id, data }).whereNull('deleted_at').first();

    return registro ?? null; // Retorna null caso seja undefined
  } catch (error) {
    Util.log.error('Erro ao buscar registro de ponto', error);
    return null;
  }
};

// Atualizar registro do dia
const atualizarRegistro = async (ponto: Omit<IPonto, 'created_at' | 'id'>): Promise<boolean> => {
  try {
    return await Knex(ETableNames.pontos).where({ usuario_id: ponto.usuario_id, data: ponto.data }).update(ponto);
  } catch (error) {
    Util.log.error('Erro ao atualizar ponto', error);
    return false;
  }
};

export const Ponto = { registrar, buscarRegistroPorData, atualizarRegistro };
