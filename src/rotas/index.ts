import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controladores } from '../controladores';

const router = Router();

router.get('/teste-api', (req, res) => res.status(StatusCodes.OK).json('API TESTADA!.'));

router.post('/entrar', Controladores.Usuario.loginValidacao, Controladores.Usuario.login);

router.post('/usuario', Controladores.Usuario.cadastrarValidacao, Controladores.Usuario.cadastrar);

router.post('/ponto', Controladores.Ponto.registrarValidacao, Controladores.Ponto.registrar);

export { router };
