import * as feriado from './feriado';
import * as justificativa from './justificativa';
import * as ponto from './ponto';
import * as usuario from './usuario';

export const Repositorios = { ...usuario, ...ponto, ...justificativa, ...feriado };
