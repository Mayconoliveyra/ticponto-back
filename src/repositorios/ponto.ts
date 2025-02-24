import moment from 'moment';

import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IPonto } from '../banco/models/ponto';
import { Util } from '../util';

const registrar = async (ponto: Omit<IPonto, 'id' | 'created_at' | 'updated_at' | 'horario' | 'deleted_at'>) => {
  try {
    const data = moment().format('YYYY-MM-DD HH:mm:00');

    return await Knex.table(ETableNames.pontos).insert({ ...ponto, horario: data });
  } catch (error) {
    Util.log.error('Erro ao inserir ponto no banco de dados', error);
    return false;
  }
};

const buscarUltimoRegistro = async (usuario_id: number) => {
  try {
    return await Knex.table(ETableNames.pontos).where({ usuario_id }).orderBy('created_at', 'desc').first();
  } catch (error) {
    Util.log.error('Falha ao buscar último registro de ponto', error);
    return null;
  }
};

export const Ponto = { registrar, buscarUltimoRegistro };
