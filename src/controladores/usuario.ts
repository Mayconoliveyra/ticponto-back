import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { IUsuario } from '../banco/models/usuario';
import { Repositorios } from '../repositorios';

type IBodyProps = Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>;

const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().trim(),
      email: yup.string().required().trim(),
    }),
  ),
}));

const cadastrar = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { nome, email } = req.body;

  const modelo = {
    nome: nome,
    email: email,
  };

  const result = await Repositorios.Usuario.cadastrar(modelo);

  if (result) {
    return res.status(StatusCodes.NO_CONTENT).send();
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

const listarTodos = async (req: Request, res: Response) => {
  try {
    const usuarios = await Repositorios.Usuario.listarTodos();
    return res.status(StatusCodes.OK).json(usuarios);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

export const Usuario = { cadastrarValidacao, cadastrar, listarTodos };
