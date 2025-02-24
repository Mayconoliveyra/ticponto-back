import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';
import { Util } from '../util';

const registrarValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ id: string }>(
    yup.object().shape({
      id: yup.string().required().trim(),
    }),
  ),
}));

const registrar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.usuario?.id as number;

    // Buscar o último registro do usuário
    const ultimoRegistro = await Repositorios.Ponto.buscarUltimoRegistro(id);

    // Definir tipo com base no último registro
    const tipo = ultimoRegistro?.tipo === 'ENTRADA' ? 'SAIDA' : 'ENTRADA';

    const result = await Repositorios.Ponto.registrar({
      usuario_id: id,
      tipo: tipo,
    });

    if (result) {
      return res.status(StatusCodes.CREATED).send();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  } catch (error) {
    Util.log.error('Erro ao registrar ponto', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: 'Erro interno ao registrar ponto' });
  }
};

export const Ponto = { registrarValidacao, registrar };
