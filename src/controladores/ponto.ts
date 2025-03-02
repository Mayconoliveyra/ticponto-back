import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import * as yup from 'yup';

import { IPonto } from '../banco/models/ponto';
import { IUsuario } from '../banco/models/usuario';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';
import { IHorariosEsperados } from '../repositorios/ponto';

import { Util } from '../util';

interface IGetPontosQuery {
  usuario_id?: number;
  data_inicio?: string;
  data_fim?: string;
  paginacao?: number;
  limite?: number;
}

// Validação do ID do usuário na requisição
const registrarValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ id: string }>(
    yup.object().shape({
      id: yup.string().required().trim(),
    }),
  ),
}));

const registrar = async (req: Request, res: Response) => {
  try {
    let horariosEsperados: IHorariosEsperados | null = null;

    const usuario = (req as any).usuario as IUsuario;
    const dataAtual = moment().format('YYYY-MM-DD');
    const horaAtual = moment().format('HH:mm:00');

    // Buscar o registro do dia, assim sabe se vai ser o primeiro ou não
    const ultimoRegistro: IPonto | null = await Repositorios.Ponto.buscarRegistroPorData(usuario.id, dataAtual);

    if (!ultimoRegistro) {
      // Só busca os horários esperados se for o PRIMEIRO registro do dia
      horariosEsperados = await Repositorios.Ponto.obterHorariosEsperados(usuario.id, dataAtual);
    }

    let atualizar = false;
    let novoRegistro: Omit<IPonto, 'created_at' | 'id'> = {
      usuario_id: usuario.id,
      data: dataAtual,
      entrada_1: undefined,
      saida_1: undefined,
      entrada_2: undefined,
      saida_2: undefined,
      extra_entrada: undefined,
      extra_saida: undefined,

      // Só vai ser setado se for o primeiro registro do dia.
      esperado_inicio_1: horariosEsperados?.esperado_inicio_1 || null,
      esperado_saida_1: horariosEsperados?.esperado_saida_1 || null,
      esperado_inicio_2: horariosEsperados?.esperado_inicio_2 || null,
      esperado_saida_2: horariosEsperados?.esperado_saida_2 || null,
    };

    if (!ultimoRegistro) {
      // Se não há registro hoje, criar um novo e marcar entrada_1
      novoRegistro.entrada_1 = horaAtual;
    } else {
      atualizar = true;

      if (!ultimoRegistro.saida_1) {
        novoRegistro = { ...ultimoRegistro, saida_1: horaAtual };
      } else if (!ultimoRegistro.entrada_2) {
        novoRegistro = { ...ultimoRegistro, entrada_2: horaAtual };
      } else if (!ultimoRegistro.saida_2) {
        novoRegistro = { ...ultimoRegistro, saida_2: horaAtual };
      } else if (!ultimoRegistro.extra_entrada) {
        novoRegistro = { ...ultimoRegistro, extra_entrada: horaAtual };
      } else if (!ultimoRegistro.extra_saida) {
        novoRegistro = { ...ultimoRegistro, extra_saida: horaAtual };
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          erro: 'Já foram registradas todas as marcações para hoje',
        });
      }
    }

    let result;
    if (atualizar) {
      result = await Repositorios.Ponto.atualizarRegistro(novoRegistro);
    } else {
      result = await Repositorios.Ponto.registrar(novoRegistro);
    }

    if (result) {
      return res.status(StatusCodes.CREATED).send();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        erro: 'Erro ao registrar ponto',
      });
    }
  } catch (error) {
    Util.log.error('Erro ao registrar ponto', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      erro: 'Erro interno ao registrar ponto',
    });
  }
};

// Definição do esquema de validação dos filtros
const consultarValidacao = Middlewares.validacao((getSchema) => ({
  query: getSchema<IGetPontosQuery>(
    yup.object().shape({
      usuario_id: yup.number().integer().optional(),
      data_inicio: yup
        .string()
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
      data_fim: yup
        .string()
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
      paginacao: yup.number().integer().optional().default(1),
      limite: yup.number().integer().optional().default(10),
    }),
  ),
}));

const consultarPontos = async (req: Request, res: Response) => {
  try {
    const { usuario_id, data_inicio, data_fim, paginacao, limite } = req.query;

    const filtros = {
      usuario_id: usuario_id ? Number(usuario_id) : undefined,
      data_inicio: data_inicio as string,
      data_fim: data_fim as string,
      paginacao: paginacao ? Number(paginacao) : 1, // Se undefined, usa 1 como padrão
      limite: limite ? Number(limite) : 10, // Se undefined, usa 10 como padrão
    };

    const pontos = await Repositorios.Ponto.buscarPontos(filtros);

    return res.status(StatusCodes.OK).json(pontos);
  } catch (error) {
    Util.log.error('Erro ao buscar pontos', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao buscar pontos.' },
    });
  }
};

export const Ponto = { registrarValidacao, registrar, consultarValidacao, consultarPontos };
