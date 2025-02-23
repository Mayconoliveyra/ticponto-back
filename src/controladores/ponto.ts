import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { IPonto } from '../banco/models/ponto';
import { Repositorios } from '../repositorios';
import { Util } from '../util';

type IBodyProps = Omit<IPonto, 'id' | 'created_at' | 'updated_at' | 'horario' | 'deleted_at'>;

const registrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      usuario_id: yup.number().required(),
      tipo: yup.string().oneOf(['ENTRADA', 'SAIDA']).required(),
    }),
  ),
}));

const registrar = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  try {
    const { usuario_id, tipo } = req.body;

    const modelo = {
      usuario_id,
      tipo,
    };

    const result = await Repositorios.Ponto.registrar(modelo);

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
