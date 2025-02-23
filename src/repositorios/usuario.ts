import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IUsuario } from '../banco/models/usuario';
import { Util } from '../util';

const cadastrar = async (usuario: Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<boolean> => {
  try {
    await Knex.table(ETableNames.usuarios).insert(usuario);

    return true;
  } catch (error) {
    Util.log.error('Falha ao cadastrar usuário', error);

    return false;
  }
};

const listarTodos = async () => {
  try {
    return await Knex('usuarios').select('*');
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const Usuario = { cadastrar, listarTodos };
