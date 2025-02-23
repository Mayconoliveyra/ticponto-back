import * as garantirAutenticado from './garantirAutenticado';
import * as JSONParseError from './JSONParseError';
import * as validacao from './validacao';

export const Middlewares = { ...JSONParseError, ...garantirAutenticado, ...validacao };
