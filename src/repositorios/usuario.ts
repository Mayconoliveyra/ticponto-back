import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IUsuario } from '../banco/models/usuario';

import { Util } from '../util';

const cadastrar = async (usuario: Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<number | null> => {
  try {
    const result = await Knex.table(ETableNames.usuarios).insert(usuario);

    // Retorna o ID do usuário recém-criado
    return result[0] || null;
  } catch (error) {
    Util.Log.error('Falha ao cadastrar usuário', error);

    return null;
  }
};

const buscarPorEmail = async (email: string): Promise<IUsuario | null> => {
  try {
    const usuario = await Knex(ETableNames.usuarios).select('*').where('email', email).first();

    return usuario || null;
  } catch (error) {
    Util.Log.error('Erro ao buscar usuário por email', error);
    return null;
  }
};

const buscarPorId = async (id: number): Promise<IUsuario | null> => {
  try {
    const usuario = await Knex(ETableNames.usuarios).select('*').where('id', id).first();

    return usuario || null;
  } catch (error) {
    Util.Log.error('Erro ao buscar usuário por id', error);
    return null;
  }
};

export const Usuario = { cadastrar, buscarPorEmail, buscarPorId };
