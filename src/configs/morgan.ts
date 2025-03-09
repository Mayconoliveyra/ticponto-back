import { Express } from 'express';
import fs from 'fs';
import morganBody from 'morgan-body';
import path from 'path';

import { Util } from '../util';

// Define o diretório de logs e cria-o, se necessário
const logDir = path.join('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Cria um stream para gravar os logs em um arquivo com a data atual
const logStream = fs.createWriteStream(path.join(logDir, `express-${Util.DataHora.obterDataAtual('DD-MM-YYYY')}.log`), { flags: 'a' });

const setupMorganBody = (app: Express) => {
  morganBody(app, {
    noColors: true,
    stream: logStream,
    prettify: true,
    filterParameters: ['token', 'auth_id', 'auth_secret'],
  });
};

export const MorganConfig = { setupMorganBody };
