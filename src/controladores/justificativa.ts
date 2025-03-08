import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { IJustificativa } from '../banco/models/justificativa';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

// Definição do tipo para o corpo da requisição
type IBodyProps = Omit<IJustificativa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      usuario_id: yup.number().required(),
      data: yup
        .string()
        .required()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
      motivo: yup.string().required().trim().max(255),
      anexo: yup.string().nullable().max(255),
    }),
  ),
}));

const cadastrar = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { usuario_id, data, motivo, anexo } = req.body;

  const modelo = { usuario_id, data, motivo, anexo };

  // Verificar se o usuário existe e está ativo
  const usuario = await Repositorios.Usuario.buscarPorId(usuario_id);

  if (!usuario) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  if (!usuario.ativo) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Usuário inativo' },
    });
  }

  // Verificar se já existe uma justificativa para o mesmo dia
  const justificativaExistente = await Repositorios.Justificativa.buscarPorUsuarioEData(usuario_id, data);

  if (justificativaExistente) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Já existe uma justificativa cadastrada para este dia' },
    });
  }

  const result = await Repositorios.Justificativa.cadastrar(modelo);

  if (result) {
    return res.status(StatusCodes.CREATED).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao cadastrar justificativa' },
    });
  }
};

const alterarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      usuario_id: yup.number().required(),
      data: yup
        .string()
        .required()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
      motivo: yup.string().required().trim().max(255),
      anexo: yup.string().nullable().max(255),
    }),
  ),
  params: getSchema<{ id: number }>(
    yup.object().shape({
      id: yup.number().required(),
    }),
  ),
}));

const alterar = async (req: Request<{ id: number }, {}, IBodyProps>, res: Response) => {
  const { id } = req.params;
  const { usuario_id, data, motivo, anexo } = req.body;

  const result = await Repositorios.Justificativa.alterar(id, { usuario_id, data, motivo, anexo });

  if (result) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao alterar justificativa' },
    });
  }
};

const excluirValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ id: number }>(
    yup.object().shape({
      id: yup.number().required(),
    }),
  ),
}));

const excluir = async (req: Request<{ id: number }>, res: Response) => {
  const { id } = req.params;

  const result = await Repositorios.Justificativa.excluir(id);

  if (result) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao excluir justificativa' },
    });
  }
};

export const Justificativa = { cadastrarValidacao, cadastrar, alterarValidacao, alterar, excluirValidacao, excluir };
