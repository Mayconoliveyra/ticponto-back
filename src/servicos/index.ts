import * as bcrypt from './bcrypt';
import * as jwt from './jwt';

export const Servicos = { ...jwt, ...bcrypt };
