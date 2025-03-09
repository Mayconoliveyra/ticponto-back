import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controladores } from '../controladores';

import { Middlewares } from '../middlewares';

const router = Router();

router.get('/teste-api', (req, res) => res.status(StatusCodes.OK).json('API TESTADA!.'));

router.post('/usuario', /* Middlewares.autenticado, */ Controladores.Usuario.cadastrarValidacao, Controladores.Usuario.cadastrar);

router.post('/entrar', Controladores.Usuario.loginValidacao, Controladores.Usuario.login);

router.post('/ponto/:id', Middlewares.autenticado, Controladores.Ponto.registrarValidacao, Controladores.Ponto.registrar);
router.get('/pontos', Middlewares.autenticado, Controladores.Ponto.consultarValidacao, Controladores.Ponto.consultar);

router.post('/justificativa', Middlewares.autenticado, Controladores.Justificativa.cadastrarValidacao, Controladores.Justificativa.cadastrar);
router.delete('/justificativa/:id', Middlewares.autenticado, Controladores.Justificativa.excluirValidacao, Controladores.Justificativa.excluir);

export { router };
