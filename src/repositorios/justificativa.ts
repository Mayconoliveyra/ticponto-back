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

const excluir = async (id: number) => {
  try {
    const dataAtual = Util.DataHora.obterDataAtual();

    return await Knex(ETableNames.justificativas).where({ id }).update({ deleted_at: dataAtual });
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

const buscarPorId = async (id: number) => {
  try {
    const justificativa = await Knex(ETableNames.justificativas)
      .where({ id })
      .whereNull('deleted_at') // Ignora registros excluídos
      .first();

    return justificativa || null;
  } catch (error) {
    Util.Log.error('Erro ao buscar justificativa por ID', error);
    return null;
  }
};
export const Justificativa = { cadastrar, excluir, buscarPorUsuarioEData, buscarPorId };
