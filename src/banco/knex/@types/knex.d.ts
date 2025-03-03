import { IEmpresa } from '../../models/empresa';
import { IFeriado } from '../../models/feriado';
import { IFeriado } from '../../models/feriado';
import { IJustificativa } from '../../models/justificativa';
import { IPonto } from '../../models/ponto';
import { IUsuario } from '../../models/usuario';
import { IVwPonto } from '../../models/vwPontoFinal';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    feriados: IFeriado;
    pontos: IPonto;
    vw_pontos: IVwPonto;
    feriados: IFeriado;
    justificativas: IJustificativa;
  }
}
