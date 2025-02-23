import { IFeriado } from '../../models/feriado';
import { IPonto } from '../../models/ponto';
import { IUsuario } from '../../models/usuario';

declare module 'knex/types/tables' {
  interface Tables {
    usuarios: IUsuario;
    feriados: IFeriado;
    pontos: IPonto;
  }
}
