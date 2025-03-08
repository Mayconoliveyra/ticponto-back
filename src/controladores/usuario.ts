import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { IUsuario } from '../banco/models/usuario';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

// Definição do tipo para validação do corpo da requisição
type IBodyProps = Omit<IUsuario, 'id' | 'ativo' | 'created_at' | 'updated_at' | 'deleted_at'>;

const cadastrarValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().max(120).trim(),
      email: yup.string().email().required().max(120).trim(),
      senha: yup.string().required().max(255).trim(),
      contato: yup.string().optional().max(13).trim().nullable(),
      nascimento: yup.string().optional().nullable(),
      notificar: yup.boolean().required(),
      administrador: yup.boolean().required(),
      empresa_id: yup.number().required(),

      // Validação de horários esperados no formato TIME (HH:MM:SS)
      segunda_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      segunda_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      segunda_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      segunda_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      terca_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      terca_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      terca_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      terca_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quarta_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quarta_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quarta_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quarta_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quinta_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quinta_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quinta_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      quinta_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sexta_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sexta_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sexta_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sexta_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sabado_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sabado_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sabado_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      sabado_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      domingo_inicio_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      domingo_saida_1: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      domingo_inicio_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
      domingo_saida_2: yup
        .string()
        .optional()
        .nullable()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):00$/, 'Formato inválido (HH:MM:00)'),
    }),
  ),
}));

const loginValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<{ email: string; senha: string }>(
    yup.object().shape({
      email: yup.string().email().required().max(255).trim(),
      senha: yup.string().required().max(255).trim(),
    }),
  ),
}));

// ---------------------------------------------------------------------------------
const cadastrar = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const {
    nome,
    email,
    senha,
    contato,
    notificar,
    nascimento,
    administrador,
    empresa_id,
    segunda_inicio_1,
    segunda_saida_1,
    segunda_inicio_2,
    segunda_saida_2,
    terca_inicio_1,
    terca_saida_1,
    terca_inicio_2,
    terca_saida_2,
    quarta_inicio_1,
    quarta_saida_1,
    quarta_inicio_2,
    quarta_saida_2,
    quinta_inicio_1,
    quinta_saida_1,
    quinta_inicio_2,
    quinta_saida_2,
    sexta_inicio_1,
    sexta_saida_1,
    sexta_inicio_2,
    sexta_saida_2,
    sabado_inicio_1,
    sabado_saida_1,
    sabado_inicio_2,
    sabado_saida_2,
    domingo_inicio_1,
    domingo_saida_1,
    domingo_inicio_2,
    domingo_saida_2,
  } = req.body;

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

    const modelo: IBodyProps = {
      nome,
      email,
      senha: senhaHasheada,
      contato,
      notificar,
      empresa_id,
      nascimento,
      administrador,
      segunda_inicio_1,
      segunda_saida_1,
      segunda_inicio_2,
      segunda_saida_2,
      terca_inicio_1,
      terca_saida_1,
      terca_inicio_2,
      terca_saida_2,
      quarta_inicio_1,
      quarta_saida_1,
      quarta_inicio_2,
      quarta_saida_2,
      quinta_inicio_1,
      quinta_saida_1,
      quinta_inicio_2,
      quinta_saida_2,
      sexta_inicio_1,
      sexta_saida_1,
      sexta_inicio_2,
      sexta_saida_2,
      sabado_inicio_1,
      sabado_saida_1,
      sabado_inicio_2,
      sabado_saida_2,
      domingo_inicio_1,
      domingo_saida_1,
      domingo_inicio_2,
      domingo_saida_2,
    };
    const usuarioId = await Repositorios.Usuario.cadastrar(modelo);

    if (usuarioId) {
      // Gera os pontos dos próximos 90 dias
      await Servicos.Ponto.gerarRegistrosPonto(usuarioId);

      return res.status(StatusCodes.NO_CONTENT).send();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao cadastrar usuário' },
      });
    }
  } catch (error) {
    Util.Log.error('Erro ao cadastrar usuário', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro interno ao cadastrar usuário' },
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Repositorios.Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Credenciais inválidas' },
      });
    }

    if (!usuario.ativo) {
      return res.status(StatusCodes.FORBIDDEN).json({
        errors: { default: 'Conta desativada. Entre em contato com o administrador.' },
      });
    }

    const senhaValida = await Servicos.Bcrypt.verificarSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Credenciais inválidas' },
      });
    }

    const token = Servicos.JWT.entrar({ id: usuario.id, name: usuario.nome, email: usuario.email });
    return res.status(StatusCodes.OK).json(token);
  } catch (error) {
    Util.Log.error('Erro ao realizar login', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro interno ao realizar login' },
    });
  }
};

export const Usuario = { cadastrarValidacao, cadastrar, loginValidacao, login };
