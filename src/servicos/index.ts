import * as bcrypt from './bcrypt';
import * as jwt from './jwt';
import * as ponto from './ponto';

export const Servicos = { ...jwt, ...bcrypt, ...ponto };
