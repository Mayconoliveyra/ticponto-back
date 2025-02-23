import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { IUsuario } from '../banco/models/usuario';
import { Repositorios } from '../repositorios';
import { Servicos } from '../servicos';
import { Util } from '../util';

// Definição do tipo para validação do corpo da requisição
type IBodyProps = Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>;

// Middleware de validação para o cadastro de usuário
const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().max(120).trim(),
      email: yup.string().email().required().max(255).trim(),
      senha: yup.string().required().max(255).trim(),
    }),
  ),
}));

// Middleware de validação para login
const loginValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<{ email: string; senha: string }>(
    yup.object().shape({
      email: yup.string().email().required().max(255).trim(),
      senha: yup.string().required().max(255).trim(),
    }),
  ),
}));

// Controlador para login de usuário
const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Repositorios.Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Credenciais inválidas' },
      });
    }

    const senhaValida = await Servicos.Bcrypt.verificarSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Credenciais inválidas' },
      });
    }

    const token = Servicos.JWT.entrar({ id: usuario.id, name: usuario.nome, email: usuario.email });
    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    Util.log.error('Erro ao realizar login', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro interno ao realizar login' },
    });
  }
};

// Controlador para cadastro de usuário
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

// Controlador para listar todos os usuários
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

export const Usuario = { cadastrarValidacao, cadastrar, listarTodos, loginValidacao, login };
