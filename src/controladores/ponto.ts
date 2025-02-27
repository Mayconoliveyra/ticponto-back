import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import * as yup from 'yup';

import { IPonto } from '../banco/models/ponto';
import { IUsuario } from '../banco/models/usuario';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Util } from '../util';

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

    // Buscar registro do dia
    const ultimoRegistro: IPonto | null = await Repositorios.Ponto.buscarRegistroPorData(usuario.id, dataAtual);

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
    };

    if (!ultimoRegistro) {
      // Se não há registro para o dia, criar um novo com a primeira entrada
      novoRegistro.entrada_1 = horaAtual;
    } else {
      // Se já existe registro para hoje, definir a próxima marcação
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
        return res.status(StatusCodes.BAD_REQUEST).json({ erro: 'Já foram registradas todas as marcações para hoje' });
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: 'Erro ao registrar ponto' });
    }
  } catch (error) {
    Util.log.error('Erro ao registrar ponto', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: 'Erro interno ao registrar ponto' });
  }
};

export const Ponto = { registrarValidacao, registrar };
