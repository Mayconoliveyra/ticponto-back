import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { IUsuario } from '../banco/models/usuario';
import { Repositorios } from '../repositorios';
import { Servicos } from '../servicos';
import { Util } from '../util';

type IBodyProps = Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>;

const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().max(120).trim(),
      email: yup.string().email().required().max(255).trim(),
      senha: yup.string().required().max(255).trim(),
    }),
  ),
}));

const cadastrar = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    // Verificar se o email já está cadastrado
    const usuarioExistente = await Repositorios.Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: 'Email já cadastrado' },
      });
    }

    const senhaHasheada = await Servicos.Bcrypt.gerarHashSenha(senha);
    if (!senhaHasheada) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao processar a senha' },
      });
    }

    const modelo = { nome, email, senha: senhaHasheada };
    const result = await Repositorios.Usuario.cadastrar(modelo);

    if (result) {
      return res.status(StatusCodes.NO_CONTENT).send();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao cadastrar usuário' },
      });
    }
  } catch (error) {
    Util.log.error('Erro ao cadastrar usuário', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro interno ao cadastrar usuário' },
    });
  }
};

const listarTodos = async (req: Request, res: Response) => {
  try {
    const usuarios = await Repositorios.Usuario.listarTodos();
    return res.status(StatusCodes.OK).json(usuarios);
  } catch (error) {
    Util.log.error('Erro ao listar usuários', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao listar usuários' },
    });
  }
};

export const Usuario = { cadastrarValidacao, cadastrar, listarTodos };
