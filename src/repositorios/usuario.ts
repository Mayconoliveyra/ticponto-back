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

const buscarPorEmail = async (email: string): Promise<IUsuario | null> => {
  try {
    const usuario = await Knex(ETableNames.usuarios).select('*').where('email', email).first();

    return usuario || null;
  } catch (error) {
    Util.log.error('Erro ao buscar usuário por email', error);
    return null;
  }
};

export const Usuario = { cadastrar, buscarPorEmail };
