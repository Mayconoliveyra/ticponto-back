import { IEmpresa } from '../../models/empresa';
import { IFeriado } from '../../models/feriado';
import { IPonto } from '../../models/ponto';
import { IUsuario } from '../../models/usuario';
import { IVwPonto } from '../../models/vwPonto';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    feriados: IFeriado;
    pontos: IPonto;
    vw_pontos: IVwPonto;
  }
}
