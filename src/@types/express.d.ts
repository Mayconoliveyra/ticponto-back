import { IUsuario } from '../banco/models/usuario';

declare module 'express-serve-static-core' {
  interface Request {
    usuario: Omit<IUsuario, 'senha'>;
  }
}
