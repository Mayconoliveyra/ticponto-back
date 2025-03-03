import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.empresas).first();
  if (result) return;

  await knex(ETableNames.empresas)
    .insert([
      {
        id: 1,
        nome: 'EMPRESA TESTE',
        cnpj_cpf: '11122233344',
        ativo: true,
      },
    ])
    .then(() => {
      console.log(`# Inserido dados na tabela ${ETableNames.empresas}`);
    });
};
