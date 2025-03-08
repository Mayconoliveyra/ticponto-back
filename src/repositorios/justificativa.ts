import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IJustificativa } from '../banco/models/justificativa';

import { Util } from '../util';

const cadastrar = async (justificativa: Omit<IJustificativa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
  try {
    return await Knex.table(ETableNames.justificativas).insert(justificativa);
  } catch (error) {
    Util.Log.error('Falha ao cadastrar justificativa', error);
    return false;
  }
};

const alterar = async (id: number, justificativa: Omit<IJustificativa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
  try {
    return await Knex.table(ETableNames.justificativas).where({ id }).update(justificativa);
  } catch (error) {
    Util.Log.error('Falha ao alterar justificativa', error);
    return false;
  }
};

const excluir = async (id: number) => {
  try {
    return await Knex.table(ETableNames.justificativas).where({ id }).delete();
  } catch (error) {
    Util.Log.error('Falha ao excluir justificativa', error);
    return false;
  }
};

const buscarPorUsuarioEData = async (usuario_id: number, data: string) => {
  try {
    return await Knex(ETableNames.justificativas).where({ usuario_id, data }).whereNull('deleted_at').first();
  } catch (error) {
    Util.Log.error('Erro ao buscar justificativa por usuário e data', error);
    return null;
  }
};

export const Justificativa = { cadastrar, alterar, excluir, buscarPorUsuarioEData };
