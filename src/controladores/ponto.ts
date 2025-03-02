import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import * as yup from 'yup';

import { IPonto } from '../banco/models/ponto';
import { IUsuario } from '../banco/models/usuario';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

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
    const usuario = (req as any).usuario as IUsuario;
    const dataAtual = moment().format('YYYY-MM-DD');
    const horaAtual = moment().format('HH:mm:00');

    // Buscar o registro do dia (agora já existe sempre)
    const registroAtual: IPonto | null = await Repositorios.Ponto.buscarRegistroPorData(usuario.id, dataAtual);

    if (!registroAtual) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        erro: 'Registro de ponto para hoje não encontrado',
      });
    }

    // Determinar qual campo de horário será preenchido
    const camposAtualizados: Partial<IPonto> = {};

    if (!registroAtual.entrada_1) {
      camposAtualizados.entrada_1 = horaAtual;
    } else if (!registroAtual.saida_1) {
      camposAtualizados.saida_1 = horaAtual;
    } else if (!registroAtual.entrada_2) {
      camposAtualizados.entrada_2 = horaAtual;
    } else if (!registroAtual.saida_2) {
      camposAtualizados.saida_2 = horaAtual;
    } else if (!registroAtual.extra_entrada) {
      camposAtualizados.extra_entrada = horaAtual;
    } else if (!registroAtual.extra_saida) {
      camposAtualizados.extra_saida = horaAtual;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        erro: 'Já foram registradas todas as marcações para hoje',
      });
    }

    // Atualizar o registro no banco de dados
    const result = await Repositorios.Ponto.atualizarRegistro({
      usuario_id: usuario.id,
      data: dataAtual,
      ...camposAtualizados, // Atualiza somente o campo necessário
    });

    if (result) {
      return res.status(StatusCodes.NO_CONTENT).send(); // Retorna 204 se tudo deu certo
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        erro: 'Erro ao atualizar ponto',
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
