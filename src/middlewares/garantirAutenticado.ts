import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Servicos } from '../servicos';
import { Util } from '../util';

const garantirAutenticado: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    const jwtData = Servicos.JWTServico.verificar(token);
    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao verificar o token' },
      });
    } else if (jwtData === 'INVALID_TOKEN') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' },
      });
    }

    return next();
  } catch (error) {
    Util.log.error('Falha ao executar: garantirAutenticado', error);
  }
};

export { garantirAutenticado };
