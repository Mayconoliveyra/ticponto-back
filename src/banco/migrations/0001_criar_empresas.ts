import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.empresas, (table) => {
      table.increments('id').primary();
      table.string('nome', 120).notNullable();
      table.string('cnpj_cpf', 14).notNullable().unique();
      table.boolean('ativo').defaultTo(true);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').nullable();
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.empresas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.empresas).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.empresas}`);
  });
}
