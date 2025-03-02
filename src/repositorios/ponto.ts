import moment from 'moment';

import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IPonto } from '../banco/models/ponto';
import { IVwPonto } from '../banco/models/vwPonto';

import { Util } from '../util';

interface IFiltros {
  usuario_id?: number;
  data_inicio?: string;
  data_fim?: string;
  paginacao: number;
  limite: number;
}

// Definição da interface de retorno com os tipos corretos
export interface IHorariosEsperados {
  esperado_inicio_1: string | null;
  esperado_saida_1: string | null;
  esperado_inicio_2: string | null;
  esperado_saida_2: string | null;
}

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

const buscarPontos = async (filtros: IFiltros): Promise<IVwPonto[]> => {
  try {
    let query = Knex.table(ETableNames.vw_pontos).select('*');

    if (filtros.usuario_id) {
      query = query.where('usuario_id', filtros.usuario_id);
    }

    if (filtros.data_inicio) {
      query = query.where('data', '>=', filtros.data_inicio);
    }

    if (filtros.data_fim) {
      query = query.where('data', '<=', filtros.data_fim);
    }

    query = query.offset((filtros.paginacao - 1) * filtros.limite).limit(filtros.limite);

    return await query;
  } catch (error) {
    Util.log.error('Erro ao buscar pontos', error);
    return [];
  }
};

const obterHorariosEsperados = async (usuario_id: number, data: string): Promise<IHorariosEsperados> => {
  const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const diaSemana = diasSemana[moment(data, 'YYYY-MM-DD').day()];

  // Mapeamos as colunas corretamente
  const colunas = {
    esperado_inicio_1: `${diaSemana}_inicio_1`,
    esperado_saida_1: `${diaSemana}_saida_1`,
    esperado_inicio_2: `${diaSemana}_inicio_2`,
    esperado_saida_2: `${diaSemana}_saida_2`,
  };

  // Buscamos os horários esperados do usuário
  const resultado = (await Knex(ETableNames.usuarios)
    .select([colunas.esperado_inicio_1, colunas.esperado_saida_1, colunas.esperado_inicio_2, colunas.esperado_saida_2])
    .where('id', usuario_id)
    .first()) as Record<string, string | null> | undefined;

  if (!resultado) {
    return {
      esperado_inicio_1: null,
      esperado_saida_1: null,
      esperado_inicio_2: null,
      esperado_saida_2: null,
    };
  }

  // Retorna os horários esperados corretamente
  return {
    esperado_inicio_1: resultado[colunas.esperado_inicio_1] || null,
    esperado_saida_1: resultado[colunas.esperado_saida_1] || null,
    esperado_inicio_2: resultado[colunas.esperado_inicio_2] || null,
    esperado_saida_2: resultado[colunas.esperado_saida_2] || null,
  };
};

const excluirRegistrosFuturosSemPonto = async (usuarioId: number, dataAtual: string) => {
  try {
    await Knex(ETableNames.pontos)
      .where('usuario_id', usuarioId)
      .andWhere('data', '>=', dataAtual) // Apenas registros futuros
      .whereNull('entrada_1')
      .whereNull('saida_1')
      .whereNull('entrada_2')
      .whereNull('saida_2')
      .whereNull('extra_entrada')
      .whereNull('extra_saida') // Exclui apenas registros sem marcações
      .delete();
  } catch (error) {
    Util.log.error('Erro ao excluir registros futuros sem ponto', error);
  }
};

export const Ponto = { registrar, buscarRegistroPorData, atualizarRegistro, buscarPontos, obterHorariosEsperados, excluirRegistrosFuturosSemPonto };
